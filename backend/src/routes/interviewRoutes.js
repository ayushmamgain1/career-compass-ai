import { Router } from "express";
import { completeInterview, getInterviewById, getInterviews, startInterview, submitAnswer } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const interviewRoutes = Router();

interviewRoutes.route("/start").post(protect, startInterview);
interviewRoutes.route("/").get(protect, getInterviews);
interviewRoutes.route("/:id").get(protect, getInterviewById);
interviewRoutes.route("/:id/answer").post(protect, submitAnswer);
interviewRoutes.route("/:id/complete").post(protect, completeInterview);

export default interviewRoutes;