import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    sendRequest,
    getMyRequests,
    getRestaurantRequests,
    acceptRequest,
    rejectRequest,
    completeRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", protect, sendRequest);

router.get("/my", protect, getMyRequests);

router.get("/restaurant", protect, getRestaurantRequests);

router.put("/:id/accept", protect, acceptRequest);

router.put("/:id/reject", protect, rejectRequest);
router.put("/:id/complete", protect, completeRequest);

export default router;