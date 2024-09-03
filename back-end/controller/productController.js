import productModel from "../models/productModel.js";
// import categoryModel from "../models/categoryModel.js";
// import EnvironmentModel from "../models/environmentModel.js";
// import ColorModel from "../models/colorModel.js";
// import fs from "fs";
// import mongoose from "mongoose";

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      environment,
      color,
      description,
      originalPrice,
      discount = 0, // Mặc định discount là 0 nếu không được cung cấp
      size,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!category || !environment || !color || !size || !originalPrice) {
      return res.status(400).json({ error: "Thiếu trường bắt buộc" });
    }

    // Kiểm tra trùng tên sản phẩm
    const existingProduct = await productModel.findOne({ productName });
    if (existingProduct) {
      return res.status(400).json({ error: "Tên sản phẩm đã tồn tại" });
    }

    // Lưu tên file ảnh nếu có ảnh được upload
    const images = req.files ? req.files.map((file) => file.filename) : [];

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      productName,
      category,
      environment,
      color,
      description,
      originalPrice,
      discount,
      size,
      image: images,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      environment,
      color,
      description,
      originalPrice,
      discount = 0,
      size,
    } = req.body;

    const { id } = req.params;

    // Kiểm tra sản phẩm tồn tại
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
    }

    // Kiểm tra tên sản phẩm trùng lặp
    if (productName) {
      const productWithSameName = await productModel.findOne({ productName });
      if (productWithSameName && productWithSameName._id.toString() !== id) {
        return res.status(400).json({ error: "Tên sản phẩm đã tồn tại" });
      }
    }

    // Cập nhật thông tin sản phẩm
    const updatedData = {
      productName: productName || existingProduct.productName,
      category: category || existingProduct.category,
      environment: environment || existingProduct.environment,
      color: color || existingProduct.color,
      description: description || existingProduct.description,
      originalPrice: originalPrice || existingProduct.originalPrice,
      discount: discount || existingProduct.discount,
      size: size || existingProduct.size,
      image: req.files
        ? req.files.map((file) => file.filename)
        : existingProduct.image, // Sử dụng ảnh mới nếu có
      updatedAt: Date.now(),
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category", "categoryName imageCategory descriptionCategory") // Lấy thông tin của category
      .populate("environment", "nameEnviroment") // Lấy thông tin của environment
      .populate("color", "nameColor"); // Lấy thông tin của color

    // Tính toán finalPrice cho tất cả sản phẩm
    const productsWithFinalPrice = products.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel
      .findById(id)
      .populate("category", "categoryName imageCategory descriptionCategory") // Lấy thông tin của category
      .populate("environment", "nameEnviroment") // Lấy thông tin của environment
      .populate("color", "nameColor"); // Lấy thông tin của color

    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
    }

    // Tính toán finalPrice
    const finalPrice =
      product.originalPrice - (product.originalPrice * product.discount) / 100;

    // Thêm finalPrice vào kết quả
    const productWithFinalPrice = {
      ...product.toObject(),
      finalPrice,
    };

    res.status(200).json(productWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// API để xóa một sản phẩm theo ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa sản phẩm theo ID
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Tìm các sản phẩm thuộc categoryId
    const products = await productModel
      .find({ category: categoryId })
      .populate("category", "categoryName imageCategory descriptionCategory") // Lấy thông tin của category
      .populate("environment", "nameEnviroment") // Lấy thông tin của environment
      .populate("color", "nameColor"); // Lấy thông tin của color

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy sản phẩm cho category này" });
    }

    // Tính toán finalPrice cho tất cả sản phẩm
    const productsWithFinalPrice = products.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  getProductsByCategoryId,
};
