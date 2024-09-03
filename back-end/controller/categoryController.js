import categoryModel from "../models/categoryModel.js";

const addCategory = async (req, res) => {
  try {
    // Kiểm tra xem có tệp hình ảnh được tải lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa upload ảnh!" });
    }
    // Lấy dữ liệu từ body của yêu cầu
    const { categoryName, descriptionCategory } = req.body;

    // Kiểm tra xem categoryName và description có được cung cấp không
    if (!categoryName || !descriptionCategory) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục và mô tả không được để trống!",
      });
    }

    // Lấy tên tệp hình ảnh
    const imageFilename = req.file.filename;

    // Kiểm tra sự tồn tại của categoryName
    const categoryNameExists = await categoryModel.findOne({ categoryName });
    if (categoryNameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Tên của loại này đã tồn tại!" });
    }

    // Tạo một danh mục mới
    const newCategory = new categoryModel({
      categoryName,
      descriptionCategory,
      imageCategory: imageFilename,
    });

    // Lưu danh mục vào cơ sở dữ liệu
    await newCategory.save();

    // Trả về phản hồi thành công
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  const { categoryName, descriptionCategory } = req.body;

  try {
    const { id } = req.params;

    // Tìm danh mục hiện tại theo ID
    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Loại không tìm thấy" });
    }

    // Tạo một đối tượng chứa các giá trị cập nhật
    const updateFields = {
      categoryName: categoryName || existingCategory.categoryName, // Giữ lại giá trị cũ nếu không có giá trị mới
      descriptionCategory:
        descriptionCategory || existingCategory.descriptionCategory, // Giữ lại giá trị cũ nếu không có giá trị mới
      imageCategory: req.file
        ? req.file.filename
        : existingCategory.imageCategory, // Giữ lại ảnh cũ nếu không có ảnh mới
    };

    // Cập nhật danh mục trong cơ sở dữ liệu
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({ updatedCategory });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  addCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
