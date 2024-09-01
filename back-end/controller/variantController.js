import VariantModel from "../models/variantModel.js";

// Tạo Variant mới
export const createVariant = async (req, res) => {
  try {
    const { size, price, quantity } = req.body;
    const newVariant = new VariantModel({ size, price, quantity });
    await newVariant.save();
    res
      .status(201)
      .json({ msg: "Variant created successfully", variant: newVariant });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// Lấy tất cả Variants
export const getAllVariants = async (req, res) => {
  try {
    const variants = await VariantModel.find();
    res.status(200).json({ variants });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// Lấy Variant theo ID
export const getVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await VariantModel.findById(id);
    if (!variant) {
      return res.status(404).json({ msg: "Variant not found" });
    }
    res.status(200).json({ variant });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// Cập nhật Variant theo ID
export const updateVariantById = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy dữ liệu variant hiện tại từ cơ sở dữ liệu
    const existingVariant = await VariantModel.findById(id);
    if (!existingVariant) {
      return res.status(404).json({ msg: "Variant not found" });
    }

    // Cập nhật chỉ các trường có trong req.body
    const updatedData = {};
    if (req.body.size) updatedData.size = req.body.size;
    if (req.body.price) updatedData.price = req.body.price;
    if (req.body.quantity) updatedData.quantity = req.body.quantity;

    // Cập nhật variant với dữ liệu mới
    const updatedVariant = await VariantModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res
      .status(200)
      .json({ msg: "Variant updated successfully", variant: updatedVariant });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// Xóa Variant theo ID
export const deleteVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVariant = await VariantModel.findByIdAndDelete(id);
    if (!deletedVariant) {
      return res.status(404).json({ msg: "Variant not found" });
    }
    res.status(200).json({ msg: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
