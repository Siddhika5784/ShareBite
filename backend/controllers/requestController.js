import mongoose from "mongoose";
import Food from "../models/Food.js";
import Request from "../models/Request.js";

export const sendRequest = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({
        success: false,
        message: "Only NGOs can request food",
      });
    }

    const { foodId, message } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Food ID",
      });
    }

    // 1. Find Food
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    if (food.restaurant.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own food",
      });
    }

    // 2. Food Available?
    if (food.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Food is no longer available",
      });
    }

    // 3. Duplicate Request Check
    const existingRequest = await Request.findOne({
      food: foodId,
      ngo: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already requested this food",
      });
    }

    // 4. Create Request
    const request = await Request.create({
      food: foodId,

      ngo: req.user.id,

      restaurant: food.restaurant,

      message,
    });

    // 5. Update Food Status
    food.status = "Requested";

    await food.save();

    return res.status(201).json({
      success: true,

      message: "Request sent successfully",

      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({
        success: false,
        message: "Only NGOs can access this resource",
      });
    }

    const requests = await Request.find({ ngo: req.user.id })
      .populate("food", "foodName quantity foodType status")
      .populate("restaurant", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRestaurantRequests = async (req, res) => {
  try {
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can access this resource",
      });
    }

    const requests = await Request.find({
      restaurant: req.user.id,
    })
      .populate("food", "foodName quantity foodType status")
      .populate("ngo", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const acceptRequest = async (req, res) => {
  try {
    // Only restaurants can accept requests
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can accept requests",
      });
    }

    const { id } = req.params;

    // Validate Request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request ID",
      });
    }

    // Find Request
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check ownership
    if (request.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request",
      });
    }

    // Request must be pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Accept current request
    request.status = "Accepted";
    await request.save();

    // Reject all other pending requests for the same food
    await Request.updateMany(
      {
        food: request.food,
        _id: { $ne: request._id },
        status: "Pending",
      },
      {
        $set: {
          status: "Rejected",
        },
      }
    );

    // Keep Food status as "Requested"
    // It will change to "Picked Up" in the Complete Request API.

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    // Only restaurants can reject requests
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can reject requests",
      });
    }

    const { id } = req.params;

    // Validate Request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request ID",
      });
    }

    // Find Request
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Ownership Check
    if (request.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this request",
      });
    }

    // Only pending requests can be rejected
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Reject Request
    request.status = "Rejected";
    await request.save();

    // If no pending or accepted requests remain,
    // make food available again.
    const remainingRequests = await Request.find({
      food: request.food,
      status: { $in: ["Pending", "Accepted"] },
    });

    if (remainingRequests.length === 0) {
      await Food.findByIdAndUpdate(request.food, {
        status: "Available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeRequest = async (req, res) => {
  try {
    // Only Restaurant can complete
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can complete requests",
      });
    }

    const { id } = req.params;

    // Validate Request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request ID",
      });
    }

    // Find Request
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check ownership
    if (request.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this request",
      });
    }

    // Only accepted requests can be completed
    if (request.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted requests can be completed",
      });
    }

    // Complete request
    request.status = "Completed";
    await request.save();

    // Update food status
    await Food.findByIdAndUpdate(request.food, {
      status: "Picked Up",
    });

    return res.status(200).json({
      success: true,
      message: "Request completed successfully",
      request,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
