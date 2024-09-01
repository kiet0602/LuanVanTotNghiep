import categoryModel from "../models/categoryModel.js";
import characteristicModel from "../models/characteristicModel.js";

const addCategory = async (req, res) => {
  try {
    // Kiểm tra xem có tệp hình ảnh được tải lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa upload ảnh!" });
    }
    // Lấy dữ liệu từ body của yêu cầu
    const { categoryName /* characteristic  */ } = req.body;
    // Kiểm tra xem categoryName và characteristic có được cung cấp không
    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục không được để trống!",
      });
    }
    /*   if (!characteristic) {
      return res.status(400).json({
        success: false,
        message: "Nơi trang trí không được để trống!",
      });
    } */
    // Lấy tên tệp hình ảnh
    const imageFilename = req.file.filename;
    // Kiểm tra sự tồn tại của characteristic
    /*   const characteristicExists = await characteristicModel.findById(
      characteristic
    );
    if (!characteristicExists) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nơi trang trí!" });
    } */

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
      /*   characteristic, */
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
  const { categoryName /*  characteristic */ } = req.body;

  try {
    const { id } = req.params;

    // Tìm danh mục hiện tại theo ID
    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).send({ error: "Loại không tìm thấy" });
    }

    // Nếu tất cả các trường đều trống, không thực hiện cập nhật và trả về danh mục cũ
    if (!categoryName && /* !characteristic && */ !req.file) {
      return res.status(200).send({ updatedCategory: existingCategory });
    }

    const updateFields = {};

    // Kiểm tra xem tên danh mục có bị trùng lặp không
    if (categoryName && categoryName !== existingCategory.categoryName) {
      const categoryNameExists = await categoryModel.findOne({ categoryName });
      if (categoryNameExists) {
        return res.status(400).send({ error: "Tên danh mục đã tồn tại" });
      }
      updateFields.categoryName = categoryName;
    }

    // Kiểm tra sự tồn tại của đặc điểm nếu có thay đổi
    /*   if (characteristic) {
      const characteristicExists = await characteristicModel.findById(
        characteristic
      );
      if (!characteristicExists) {
        return res.status(400).send({ error: "Không tìm thấy nơi trang trí" });
      }
      updateFields.characteristic = characteristic;
    } */

    // Cập nhật ảnh nếu có tệp được tải lên
    if (req.file) {
      updateFields.imageCategory = req.file.filename;
    }

    // Cập nhật danh mục trong cơ sở dữ liệu nếu có thay đổi
    if (Object.keys(updateFields).length > 0) {
      await categoryModel.updateOne({ _id: id }, { $set: updateFields }).exec();
    }

    // Lấy danh mục đã được cập nhật
    const updatedCategory = await categoryModel.findById(id);
    return res.status(200).send({ updatedCategory });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export {
  addCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
