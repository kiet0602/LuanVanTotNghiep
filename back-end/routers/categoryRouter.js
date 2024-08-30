import express from "express";
import { addCategory } from "../controller/categoryController.js";
import multer from "multer";

const categoryRouter = express.Router();
const storage = multer.diskStorage({
  destination: "uploads", // Thư mục lưu trữ hình ảnh tải lên sẽ được lưu vào thư mục có tên là 'uploads'.
  filename: (req, file, cb) => {
    // Hàm callback để xác định tên tệp khi nó được lưu.
    return cb(null, `${Date.now()}_${file.originalname}`); // Tạo tên tệp mới bằng cách kết hợp thời gian hiện tại và tên tệp gốc.
  },
});
const upload = multer({ storage: storage });

categoryRouter.post(
  "/addCategory",
  upload.single("imageCategory"),
  addCategory
);

export default categoryRouter;
