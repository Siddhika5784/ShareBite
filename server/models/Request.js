import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected","Completed"],
      default: "Pending",
    },

    message: {
      type: String,
      trim: true,
      maxlength:300,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);