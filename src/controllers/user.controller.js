import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const GenerateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wront in accessing and refresh token")
    }
}
const RegisterUser = asyncHandler(async (req, res) => {
    // Get user details from request body
    const { fullName, email, username, password } = req.body;

    console.log("email:", email);

    // Check if all required fields are provided
    if (
        [fullName, email, username, password].some(
            (field) => !field?.trim()
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    // Get local file paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Avatar is required
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Upload avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Upload cover image if provided
    let coverImage;

    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    // Check if avatar upload was successful
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // Create user in database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Server side error");
    }

    // Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User created successfully"
        )
    );
})
const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password }= req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "user does not exist ")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "user password is incorrect ")
    }
    const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly :true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accessToken,refreshToken,
            },"user logged in successfully"
        )
    )
})

const logoutUser = asyncHandler (async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly :true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out "))
})



export {
    RegisterUser,
    loginUser,
    logoutUser
};