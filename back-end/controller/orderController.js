import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import VariantModel from "../models/variantModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;

    // Tìm sản phẩm và biến thể
    const product = await productModel.findById(productId);
    const variant = await VariantModel.findById(variantId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // Kiểm tra số lượng tồn kho của biến thể
    if (variant.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Not enough stock for the requested quantity" });
    }

    // Giảm số lượng tồn kho
    variant.quantity -= quantity;
    await variant.save();

    // Cập nhật số lượng đơn hàng cho sản phẩm
    product.orderCount += quantity;
    await product.save();

    return res.status(200).json({
      message: "Order placed successfully",
      order: {
        productId,
        variantId,
        quantity,
        userId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};
