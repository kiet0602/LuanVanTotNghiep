import express from "express";
import multer from "multer";
import {
  addImageProduct,
  deleteImageById,
  getAllImages,
  getImageById,
  updateImageById,
} from "../controller/imageController.js";

const imageRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads", // Thư mục lưu trữ hình ảnh tải lên sẽ được lưu vào thư mục có tên là 'uploads'.
  filename: (req, file, cb) => {
    // Hàm callback để xác định tên tệp khi nó được lưu.
    return cb(null, `${Date.now()}_${file.originalname}`); // Tạo tên tệp mới bằng cách kết hợp thời gian hiện tại và tên tệp gốc.
  },
});
const upload = multer({ storage: storage });

imageRouter.post("/uploadImage", upload.single("url"), addImageProduct);
imageRouter.get("/getAllImages", getAllImages);

// Route để lấy hình ảnh theo ID
imageRouter.get("/getImage/:id", getImageById);

// Route để cập nhật hình ảnh theo ID
imageRouter.put("/updateImage/:id", upload.single("url"), updateImageById);

// Route để xóa hình ảnh theo ID
imageRouter.delete("/deleteImages/:id", deleteImageById);

export default imageRouter;
