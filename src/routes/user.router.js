import { Router } from "express";
import { RegisterUser } from "../controllers/register.controller.js";

const router =Router()

router.route("/register").post(RegisterUser)

// https://localgost:8000/api/v1/users/resiter

export default router