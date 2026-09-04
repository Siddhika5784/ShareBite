import Message from "../models/Message.js";
import Request from "../models/Request.js";

export const getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (
      request.restaurant.toString() !== req.user.id &&
      request.ngo.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (request.status !== "Accepted") {
      return res.status(403).json({
        success: false,
        message: "Chat is available only after request acceptance",
      });
    }

    const messages = await Message.find({
      roomId: requestId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
