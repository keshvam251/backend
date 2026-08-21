import { Router } from "express";
import { RegisterUser,changeCurrentPassword,getCurrentUser,getUserDetails,getWatchHistory,loginUser,logoutUser,refreshAccessToken, updateAccountAvatar, updateAccountCoverImage, updateAccountDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router =Router()

router.route("/register").post(             //middelware injection 
    upload.fields([
        {
            name:"avatar",              /* we are injecting the middleware for taking the file avatar ,coverimage*/ 
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),                      
    RegisterUser                           
)                                           


router.route("/login").post(loginUser)

// secured Users 
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-details").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAccountAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),updateAccountCoverImage)
router.route("/c/:username").get(verifyJWT,getUserDetails)
//we have used params thatswhy we add the : here 
router.route("/history").get(verifyJWT,getWatchHistory)
export default router