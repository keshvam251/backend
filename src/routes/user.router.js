import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router =Router()

router.route("/register").post(             //middelware injection 
    upload.fields([
        {
            name:"avatar",              /* we are injecting the middleware for taking the file avatar ,coverimage*/ 
            maxCount:1
        },
        {
            name:"cover image",
            maxCount:1
        }
    ]),                      
    RegisterUser                           
)                                           


// https://localgost:8000/api/v1/users/resiter

export default router