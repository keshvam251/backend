import { asyncHandler } from "../utils/asynchandler.js";
import {ApiErrors} from "../utils/ApiError.js"
import { use } from "react";
import User from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const RegisterUser = asyncHandler(async (req,res)=> {
    
    const {fullName,email,username,password}=req.body
    console.log("email: ",email)

    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
      throw new ApiErrors(400,"all fields are required")
    }
   const existedUser= User.findone({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiErrors(409,"user already  existed")
    }
    const avatarlocalPath=req.files?.avatar[0]?.path;
    const coverImagelocalpath=req.files?.coverImage[0]?.path;
    if(!avatarlocalPath){
        throw new ApiErrors(400,"avatar is required ")
    }
   const avatar= await uploadCloudinary(avatarlocalPath)
   const coverImage= await uploadCloudinary(coverImagelocalpath)

    if(!avatar){
        throw new ApiErrors(400,"avatar is required ")
    }

    const user =await User.create({       //creating this fields in database 
        fullName,
        avatar:avatar.url,
        coverImage:coverImage.url || "",
        email,
        username:username.toLowerCase ()
    })
    const createdUser =await User.findById(user._id).select(
        "-password -refreshToken "          //fields we dont wanna send in db  
    )

    if(!createdUser){
        throw new ApiErrors(500,"server side error")
    }

    return res.status(200).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )
})

export { RegisterUser }