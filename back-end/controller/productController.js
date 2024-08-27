import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js"; // Nhập model Category
import fs from "fs";

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    // Kiểm tra xem tệp có được tải lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }

    const { productName, description, price, category } = req.body;
    const imageFilename = req.file.filename;

    // Kiểm tra xem danh mục có tồn tại không
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }
    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const productNameExists = await productModel.findOne({ productName });
    if (productNameExists) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      productName,
      description,
      price,
      category, // Đây là ObjectId của danh mục
      image: imageFilename,
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    await newProduct.save();

    // Trả về phản hồi thành công
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    // Ghi lỗi vào console
    console.error("Error adding product:", error.message);

    // Trả về phản hồi lỗi
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Lấy ID sản phẩm từ tham số URL (ví dụ: /updateProduct/:id)
    const { id } = req.params;

    // Kiểm tra xem tệp hình ảnh có được tải lên không (nếu có)
    const imageFilename = req.file ? req.file.filename : undefined;

    const { productName, description, price, category } = req.body;

    // Tìm sản phẩm theo ID
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Kiểm tra xem danh mục có tồn tại không
    if (category) {
      const categoryExists = await categoryModel.findById(category);
      if (!categoryExists) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }
    }

    // Cập nhật thông tin sản phẩm
    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    if (imageFilename) {
      product.image = imageFilename;
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    await product.save();

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    // Ghi lỗi vào console
    console.error("Error updating product:", error.message);

    // Trả về phản hồi lỗi
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

export { addProduct, updateProduct };
