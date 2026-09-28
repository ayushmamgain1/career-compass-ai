import { Router } from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRoutes = Router();

authRoutes.route("/register").post(registerUser);
authRoutes.route("/login").post(loginUser);
authRoutes.route("/profile").get(protect, getUserProfile);
authRoutes.route("/profile").put(protect, updateUserProfile);

export default authRoutes;