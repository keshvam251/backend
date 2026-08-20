import { Router } from "express";
import { RegisterUser,loginUser,logoutUser } from "../controllers/user.controller.js";
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
export default router