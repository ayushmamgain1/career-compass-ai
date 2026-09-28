import { Router } from "express";
import { downloadCareerReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const reportRoutes = Router();

reportRoutes.route("/download").get(protect, downloadCareerReport);

export default reportRoutes;