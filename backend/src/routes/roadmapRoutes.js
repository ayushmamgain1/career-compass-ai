import { Router } from "express";
import { createGeneralRoadmap, createRoadmapForJob } from "../controllers/roadmapController.js";
import { protect } from "../middleware/authMiddleware.js";

const roadmapRoutes = Router();

roadmapRoutes.route("/general").post(protect, createGeneralRoadmap);
roadmapRoutes.route("/:jobId").post(protect, createRoadmapForJob);

export default roadmapRoutes;