import Food from "../models/Food.js";

export const createFood = async (req, res) => {
  try {
    const {
      foodName,
      description,
      quantity,
      foodType,
      expiryTime,
      pickupAddress,
    } = req.body;

    if (
      !foodName ||
      !description ||
      !quantity ||
      !foodType ||
      !expiryTime ||
      !pickupAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (new Date(expiryTime) <= new Date()) {
  return res.status(400).json({
    success: false,
    message: "Expiry time must be in the future",
  });
}

    const food = await Food.create({
      restaurant: req.user.id,
      foodName,
      description,
      quantity,
      foodType,
      expiryTime,
      pickupAddress,
    });

    return res.status(201).json({
      success: true,
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFoods = async (req, res) => {
  try {

   const foods = await Food.find({
    status: "Available"
})
.sort({ createdAt: -1 })
.populate("restaurant","name phone address");

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getFoodById = async (req, res) => {
  try {

    const { id } = req.params;

    const food = await Food.findById(id)
      .populate("restaurant", "name phone address");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateFood = async (req, res) => {
  try {

    const { id } = req.params;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Check ownership
    if (food.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this food",
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food: updatedFood,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFood = async (req, res) => {
  try {

    const { id } = req.params;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Check ownership
    if (food.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this food",
      });
    }

    await food.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};