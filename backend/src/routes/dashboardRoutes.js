import { Router } from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const dashboardRoutes = Router();

dashboardRoutes.route("/").get(protect, getDashboardData);

export default dashboardRoutes;