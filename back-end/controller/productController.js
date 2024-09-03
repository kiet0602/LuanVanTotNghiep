import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import VariantModel from "../models/variantModel.js"; // Import Variant model
import EnvironmentModel from "../models/environmentModel.js";
import ColorModel from "../models/colorModel.js";
import fs from "fs";
import mongoose from "mongoose";

// Thêm sản phẩm
// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    // Kiểm tra xem tệp có được tải lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }

    const { productName, description, category, environment, color, variants } =
      req.body;
    const imageFilename = req.file.filename;

    // Kiểm tra xem danh mục có tồn tại không
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // Kiểm tra xem environment và color có tồn tại không
    const environmentExists = await EnvironmentModel.findById(environment);
    const colorExists = await ColorModel.findById(color);
    if (!environmentExists || !colorExists) {
      return res
        .status(400)
        .json({ success: false, message: "Environment or Color not found" });
    }

    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const productNameExists = await productModel.findOne({ productName });
    if (productNameExists) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    // Kiểm tra sự tồn tại của variants
    if (!variants) {
      return res
        .status(400)
        .json({ success: false, message: "Variants must be provided" });
    }

    // Chuyển đổi các ID variant từ chuỗi thành ObjectId
    const variantIds = JSON.parse(variants).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Kiểm tra sự tồn tại của các variant
    const validVariants = await VariantModel.find({ _id: { $in: variantIds } });
    if (validVariants.length !== variantIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "Some variants are invalid" });
    }

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      productName,
      description,
      category,
      environment,
      color,
      image: imageFilename,
      variants: validVariants,
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

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const imageFilename = req.file ? req.file.filename : undefined;

    const { productName, description, category, environment, color, variants } =
      req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Kiểm tra xem tên sản phẩm mới có bị trùng lặp không
    if (productName && productName !== product.productName) {
      const productNameExists = await productModel.findOne({ productName });
      if (productNameExists) {
        return res
          .status(400)
          .json({ success: false, message: "Product name already exists" });
      }
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

    // Kiểm tra xem environment có tồn tại không
    if (environment) {
      const environmentExists = await EnvironmentModel.findById(environment);
      if (!environmentExists) {
        return res
          .status(400)
          .json({ success: false, message: "Environment not found" });
      }
    }

    // Kiểm tra xem color có tồn tại không
    if (color) {
      const colorExists = await ColorModel.findById(color);
      if (!colorExists) {
        return res
          .status(400)
          .json({ success: false, message: "Color not found" });
      }
    }

    // Kiểm tra sự tồn tại của variants nếu có
    if (variants) {
      try {
        const variantIds = JSON.parse(variants).map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        const validVariants = await VariantModel.find({
          _id: { $in: variantIds },
        });
        if (validVariants.length !== variantIds.length) {
          return res
            .status(400)
            .json({ success: false, message: "Some variants are invalid" });
        }
        product.variants = validVariants;
      } catch (error) {
        console.error("Error parsing variants JSON:", error.message);
        return res
          .status(400)
          .json({ success: false, message: "Invalid variants data" });
      }
    }

    if (imageFilename) {
      product.image = imageFilename;
    }

    // Cập nhật thông tin sản phẩm
    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.category = category || product.category;
    product.environment = environment || product.environment;
    product.color = color || product.color;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category environment color variants");
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel
      .findById(id)
      .populate("category environment color variants");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Xóa tệp hình ảnh nếu có (thay đổi đường dẫn tùy thuộc vào cách bạn lưu trữ hình ảnh)
    if (product.image) {
      fs.unlink(`path_to_images_directory/${product.image}`, (err) => {
        if (err) console.error(`Error deleting image file: ${err.message}`);
      });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Lấy sản phẩm theo danh mục
const getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productModel
      .find({ category: categoryId })
      .populate("category environment color variants");
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export {
  addProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  getProductByCategory,
};
