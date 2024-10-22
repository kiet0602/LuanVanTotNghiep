import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const Auth = async (req, res, next) => {
  try {
    // Lấy token từ header authorization
    const token = req.headers.authorization.split(" ")[1];

    // Giải mã token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user dựa trên thông tin từ token
    const user = await userModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Lưu chỉ userId vào request để sử dụng trong các middleware tiếp theo
    req.user = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== true) {
    return res
      .status(403)
      .json({ message: "Access Denied. You are not an admin." });
  }
  next();
};

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

export { isAdmin, Auth };
