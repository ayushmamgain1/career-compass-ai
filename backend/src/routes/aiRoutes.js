import { Router } from "express";
import { runResumeAnalysis } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const aiRoutes = Router();

aiRoutes.route("/analyze-resume/:resumeId").post(protect, runResumeAnalysis);

export default aiRoutes;