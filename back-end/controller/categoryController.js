import categoryModel from "../models/categoryModel.js";
import classificationModel from "../models/Classification.js";

// Thêm một danh mục mới
const addCategory = async (req, res) => {
  try {
    // Kiểm tra xem có tệp hình ảnh được tải lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa upload ảnh!" });
    }

    // Lấy dữ liệu từ body của yêu cầu
    const { categoryName, descriptionCategory, classification } = req.body;

    // Kiểm tra xem categoryName, descriptionCategory và classification có được cung cấp không
    if (!categoryName || !descriptionCategory || !classification) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục, mô tả và phân loại không được để trống!",
      });
    }

    // Kiểm tra sự tồn tại của classification
    const classificationExists = await classificationModel.findById(
      classification
    );
    if (!classificationExists) {
      return res.status(400).json({
        success: false,
        message: "Phân loại này không tồn tại!",
      });
    }

    // Lấy tên tệp hình ảnh
    const imageFilename = req.file.filename;

    // Kiểm tra sự tồn tại của categoryName
    const categoryNameExists = await categoryModel.findOne({ categoryName });
    if (categoryNameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Tên danh mục này đã tồn tại!" });
    }

    // Tạo một danh mục mới
    const newCategory = new categoryModel({
      categoryName,
      descriptionCategory,
      classification,
      imageCategory: imageFilename,
    });

    // Lưu danh mục vào cơ sở dữ liệu
    await newCategory.save();

    // Trả về phản hồi thành công
    res.status(201).json(newCategory);
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm danh mục",
      error: error.message,
    });
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel
      .findById(id)
      .populate("classification");

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh mục", error: error.message });
  }
};

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().populate("classification");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message,
    });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để xóa!" });
    }
    res.status(200).json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa danh mục", error: error.message });
  }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, descriptionCategory, classification } = req.body;

    // Tìm danh mục hiện tại theo ID
    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Danh mục không tìm thấy" });
    }

    // Tạo một đối tượng chứa các giá trị cập nhật
    const updateFields = {
      categoryName: categoryName || existingCategory.categoryName,
      descriptionCategory:
        descriptionCategory || existingCategory.descriptionCategory,
      classification: classification || existingCategory.classification,
      imageCategory: req.file
        ? req.file.filename
        : existingCategory.imageCategory,
    };

    // Cập nhật danh mục trong cơ sở dữ liệu
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({ updatedCategory });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Lỗi khi cập nhật danh mục", message: error.message });
  }
};

const getCategoriesByClassification = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm danh mục theo phân loại
    const categories = await categoryModel.find({
      classification: id,
    });
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục nào cho phân loại này!" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh mục theo phân loại",
      error: error.message,
    });
  }
};

export {
  addCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getCategoriesByClassification,
};
