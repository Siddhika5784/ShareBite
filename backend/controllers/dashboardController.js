import Food from "../models/Food.js";
import Request from "../models/Request.js";

export const getRestaurantDashboard = async (req, res) => {
  try {

    // Only Restaurant
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can access dashboard",
      });
    }

    const restaurantId = req.user.id;

    const [
      totalFoods,
      availableFoods,
      requestedFoods,
      pickedUpFoods,
      expiredFoods,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
      completedRequests,
    ] = await Promise.all([

      Food.countDocuments({
        restaurant: restaurantId,
      }),

      Food.countDocuments({
        restaurant: restaurantId,
        status: "Available",
      }),

      Food.countDocuments({
        restaurant: restaurantId,
        status: "Requested",
      }),

      Food.countDocuments({
        restaurant: restaurantId,
        status: "Picked Up",
      }),

      Food.countDocuments({
        restaurant: restaurantId,
        status: "Expired",
      }),

      Request.countDocuments({
        restaurant: restaurantId,
      }),

      Request.countDocuments({
        restaurant: restaurantId,
        status: "Pending",
      }),

      Request.countDocuments({
        restaurant: restaurantId,
        status: "Accepted",
      }),

      Request.countDocuments({
        restaurant: restaurantId,
        status: "Rejected",
      }),

      Request.countDocuments({
        restaurant: restaurantId,
        status: "Completed",
      }),

    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        totalFoods,
        availableFoods,
        requestedFoods,
        pickedUpFoods,
        expiredFoods,

        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests,
        completedRequests,
      },

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const getNgoDashboard = async (req, res) => {
  try {

    // Only NGOs
    if (req.user.role !== "ngo") {
      return res.status(403).json({
        success: false,
        message: "Only NGOs can access dashboard",
      });
    }

    const ngoId = req.user.id;

    const [
      totalRequests,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
      completedRequests,
    ] = await Promise.all([

      Request.countDocuments({
        ngo: ngoId,
      }),

      Request.countDocuments({
        ngo: ngoId,
        status: "Pending",
      }),

      Request.countDocuments({
        ngo: ngoId,
        status: "Accepted",
      }),

      Request.countDocuments({
        ngo: ngoId,
        status: "Rejected",
      }),

      Request.countDocuments({
        ngo: ngoId,
        status: "Completed",
      }),

    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests,
        completedRequests,
      },

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};