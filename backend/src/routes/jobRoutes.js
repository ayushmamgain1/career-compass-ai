import { Router } from "express";
import { createJob, getAllJobs, getJobById, getJobRecommendations, searchJobs } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const jobRoutes = Router();

jobRoutes.route("/search").get(protect, searchJobs);
jobRoutes.route("/recommendations").get(protect, getJobRecommendations);
jobRoutes.route("/").get(protect, getAllJobs);
jobRoutes.route("/").post(protect, createJob);
jobRoutes.route("/:id").get(protect, getJobById);

export default jobRoutes;