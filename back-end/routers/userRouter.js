import express from "express";
import {
  adminLogin,
  authenticate,
  createResetSession,
  generateOTP,
  getAllUsers,
  getAllUsersWithOrderStatus,
  getUser,
  login,
  register,
  resetPassword,
  updateUser,
  verifyOTP,
  verifyUser,
} from "../controller/userController.js";
import { localVariables, Auth, isAdmin } from "../middleware/auth.js";

import { registerMail } from "../controller/mailer.js";
import multer from "multer";

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads", // Thư mục lưu trữ hình ảnh tải lên sẽ được lưu vào thư mục có tên là 'uploads'.
  filename: (req, file, cb) => {
    // Hàm callback để xác định tên tệp khi nó được lưu.
    return cb(null, `${Date.now()}_${file.originalname}`); // Tạo tên tệp mới bằng cách kết hợp thời gian hiện tại và tên tệp gốc.
  },
});

const upload = multer({ storage: storage });

//POST
userRouter.post("/register", register);
userRouter.post("/registerMail", registerMail);
userRouter.post("/authenticate", verifyUser, authenticate);
userRouter.post("/login", verifyUser, login);
userRouter.post("/loginAdmin", adminLogin);

//GET
userRouter.get("/getUser", Auth, getUser);
userRouter.get("/generateOTP", verifyUser, localVariables, generateOTP);
userRouter.get("/verifyOTP", verifyOTP);
userRouter.get("/createResetSession", createResetSession);
userRouter.get("/getAllUser", getAllUsers);
userRouter.get("/UsersOrderedAndNoOrder", getAllUsersWithOrderStatus);
//PUT
userRouter.put("/updateUser", Auth, upload.single("avatar"), updateUser);
userRouter.put("/resetPassword", verifyUser, resetPassword);

//DELETE

export default userRouter;
