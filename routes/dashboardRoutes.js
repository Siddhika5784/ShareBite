import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRestaurantDashboard,
  getNgoDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/restaurant", protect, getRestaurantDashboard);

router.get("/ngo", protect, getNgoDashboard);

export default router;