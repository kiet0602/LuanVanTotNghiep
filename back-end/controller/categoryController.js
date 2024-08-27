import Category from "../models/categoryModel.js";

// Thêm danh mục
const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const existingCategory = await Category.findOne({
      categoryName: categoryName,
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }
    const newCategory = new Category({
      categoryName: categoryName,
    });
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi lỗi
    console.error("Error adding category:", error.message);
    res.status(500).json({ success: false, message: "Error adding category" });
  }
};
export { addCategory };
