// // multerConfig.js
// import multer from "multer";
// import path from "path";

// // Định nghĩa nơi lưu trữ file và cách đặt tên file
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Kiểm tra loại file upload
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Chỉ cho phép upload file ảnh!"), false);
//   }
// };

// // Cấu hình multer cho trường hình ảnh
// const upload = multer({ storage, fileFilter });

// export default upload;

// multerConfig.js
import multer from "multer";
import path from "path";

// Định nghĩa nơi lưu trữ file và cách đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Kiểm tra loại file upload (ảnh và video)
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  const allowedVideoTypes = [
    "video/mp4",
    "video/mkv",
    "video/avi",
    "video/mov",
  ];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file ảnh và video!"), false);
  }
};

// Cấu hình multer cho trường hình ảnh và video
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Giới hạn kích thước file (100 MB)
});

export default upload;
