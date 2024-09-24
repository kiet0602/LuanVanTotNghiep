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

    // Loại bỏ khoảng trắng dư thừa và chuẩn hóa khoảng trắng
    const formattedColorName = nameColor.trim().replace(/\s+/g, " ");

    // Sử dụng regex để kiểm tra không phân biệt hoa thường và khoảng trắng
    const existingColor = await ColorModel.findOne({
      nameColor: { $regex: `^${formattedColorName}$`, $options: "i" },
    });

    if (existingColor) {
      return res.status(400).json({ msg: "Màu này đã tồn tại" });
    }

    // Tạo màu mới với tên đã được định dạng
    const newColor = new ColorModel({
      ...req.body,
      nameColor: formattedColorName,
    });
    await newColor.save();

    res.status(201).json(newColor);
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
      return res.status(404).json({ msg: "Màu sắc không tồn tại" });
    }

    // Kiểm tra xem có màu sắc nào khác có cùng giá trị với updateData hay không
    const duplicateColor = await ColorModel.findOne({
      name: updateData.name, // Giả sử bạn có trường 'name' trong model
      _id: { $ne: id }, // Loại trừ màu sắc hiện tại
    });

    // Cập nhật các trường có giá trị trong req.body
    const updatedColor = await ColorModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ msg: "Cập nhật màu sắc thành công", color: updatedColor });
  } catch (error) {
    res.status(500).json({ msg: "Lỗi máy chủ", error: error.message });
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
