import { Router } from "express";
import { getUserProfile, googleAuth, loginUser, registerUser, resendEmailOTP, updateUserProfile, verifyEmailOTP } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRoutes = Router();

authRoutes.route("/register").post(registerUser);
authRoutes.route("/verify-otp").post(verifyEmailOTP);
authRoutes.route("/resend-otp").post(resendEmailOTP);
authRoutes.route("/google").post(googleAuth);
authRoutes.route("/login").post(loginUser);
authRoutes.route("/profile").get(protect, getUserProfile);
authRoutes.route("/profile").put(protect, updateUserProfile);

export default authRoutes;