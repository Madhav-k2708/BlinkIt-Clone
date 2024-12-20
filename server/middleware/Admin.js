import userModel from "../models/userModel.js";

export const admin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (user.role !== "ADMIN") {
      return res.status(401).json({
        message: "Permission denied",
        success: false,
        error: true,
      });
    }

    next()

  } catch (error) {
    return res.status(500).json({
      message: "Permision denied",
      error: true,
      success: true,
    });
  }
};
