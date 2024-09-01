import ColorModel from "../models/colorModel.js";

export const getAllColors = async (req, res) => {
  try {
    const colors = await ColorModel.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await ColorModel.findById(id);
    if (!color) {
      return res.status(404).json({ msg: "Color not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const createColor = async (req, res) => {
  try {
    const { nameColor } = req.body;
    const existingColor = await ColorModel.findOne({ nameColor });
    if (existingColor) {
      return res.status(400).json({ msg: "Color already exists" });
    }

    const newColor = new ColorModel(req.body);
    await newColor.save();
    res
      .status(201)
      .json({ msg: "Color created successfully", color: newColor });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingColor = await ColorModel.findById(id);
    if (!existingColor) {
      return res.status(404).json({ msg: "Color not found" });
    }

    // Cập nhật các trường có giá trị trong req.body, giữ nguyên các trường không có giá trị
    const updatedColor = await ColorModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ msg: "Color updated successfully", color: updatedColor });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const deleteColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedColor = await ColorModel.findByIdAndDelete(id);
    if (!deletedColor) {
      return res.status(404).json({ msg: "Color not found" });
    }
    res.status(200).json({ msg: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
