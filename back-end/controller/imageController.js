import Image from "../models/imageProductModel.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const addImageProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const imageUrl = req.file.filename;

    // Tạo hình ảnh mới
    const newImage = new Image({
      url: imageUrl, // Lưu URL của hình ảnh
    });
    await newImage.save();
    res
      .status(201)
      .json({ msg: "Image uploaded successfully", image: newImage });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
const updateImageById = async (req, res) => {
  try {
    const { id } = req.params;
    let imageUrl;

    if (req.file) {
      // Nếu có tệp mới
      const oldImage = await Image.findById(id);
      if (oldImage) {
        const oldImagePath = join(__dirname, "../uploads", oldImage.url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Xóa hình ảnh cũ
        }
      }
      imageUrl = req.file.filename;
    } else {
      // Nếu không có tệp mới, giữ nguyên URL cũ
      imageUrl = req.body.url;
    }

    // Cập nhật hình ảnh mới
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { url: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ msg: "Image not found" });
    }

    res
      .status(200)
      .json({ msg: "Image updated successfully", image: updatedImage });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
const deleteImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await Image.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ msg: "Image not found" });
    }

    res
      .status(200)
      .json({ msg: "Image deleted successfully", image: deletedImage });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ msg: "Image not found" });
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export {
  addImageProduct,
  updateImageById,
  deleteImageById,
  getImageById,
  getAllImages,
};
