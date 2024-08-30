import categoryModel from "../models/categoryModel.js";

import path from "path"; // Để xử lý đường dẫn của tệp
import characteristicModel from "../models/characteristicModel.js";

const addCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }
    // Kiểm tra xem các trường bắt buộc có được cung cấp không
    const { categoryName, characteristic } = req.body;
    const imageFilename = req.file.filename;

    const characteristicExists = await characteristicModel.findById(
      characteristic
    );
    if (!characteristicExists) {
      return res
        .status(400)
        .json({ success: false, message: "Characteristic not found" });
    }
    const categoryNameExists = await categoryModel.findOne({ categoryName });
    if (categoryNameExists) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Tạo một danh mục mới
    const newCategory = new categoryModel({
      categoryName,
      characteristic,
      imageCategory: imageFilename,
    });

    // Lưu danh mục vào cơ sở dữ liệu
    await newCategory.save();
    res.status(201).json({ category: newCategory }); // Trả về danh mục đã được tạo thành công
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi
  }
};

export { addCategory };
