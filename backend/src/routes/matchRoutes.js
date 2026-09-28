import { Router } from "express";
import { bulkSkillGapAnalysis, matchResumeToJob } from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const matchRoutes = Router();

matchRoutes.route("/skill-gap/bulk").post(protect, bulkSkillGapAnalysis);
matchRoutes.route("/:jobId").post(protect, matchResumeToJob);

export default matchRoutes;