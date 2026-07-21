import express from "express";
import { createFood,getFoods ,getFoodById,updateFood,deleteFood} from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFood);
router.get("/", protect, getFoods);
router.get("/:id", protect, getFoodById);
router.put("/:id", protect, updateFood);
router.delete("/:id", protect, deleteFood);

export default router;