import { Router } from "express";
import { deleteResume, getActiveResume, getResumeById, getResumes, uploadResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const resumeRoutes = Router();

resumeRoutes.route("/upload").post(protect, upload.single("resume"), uploadResume);
resumeRoutes.route("/").get(protect, getResumes);
resumeRoutes.route("/active").get(protect, getActiveResume);
resumeRoutes.route("/:id").get(protect, getResumeById);
resumeRoutes.route("/:id").delete(protect, deleteResume);

export default resumeRoutes;