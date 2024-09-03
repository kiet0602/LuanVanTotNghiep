import productModel from "../models/productModel.js";
import VariantModel from "../models/variantModel.js";

const calculateTotalAmount = async (products) => {
  let totalAmount = 0;
  for (const item of products) {
    const variant = await VariantModel.findById(item.variantId);
    if (variant) {
      totalAmount += variant.price * item.quantity;
    }
  }
  return totalAmount;
};

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;

    // Tìm giỏ hàng của người dùng
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // Nếu không tìm thấy giỏ hàng, tạo giỏ hàng mới
      cart = new cartModel({
        userId,
        products: [{ productId, variantId, quantity }],
      });
    } else {
      // Nếu tìm thấy giỏ hàng, kiểm tra sản phẩm đã có chưa
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.variantId.toString() === variantId
      );

      if (productIndex > -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart.products[productIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
        cart.products.push({ productId, variantId, quantity });
      }
    }

    // Tính tổng tiền
    cart.totalAmount = await calculateTotalAmount(cart.products);

    // Lưu giỏ hàng vào cơ sở dữ liệu
    await cart.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;

    // Tìm giỏ hàng của người dùng
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tìm chỉ số sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.variantId.toString() === variantId
    );

    if (productIndex > -1) {
      if (quantity <= 0) {
        // Nếu số lượng nhỏ hơn hoặc bằng 0, xóa sản phẩm khỏi giỏ hàng
        cart.products.splice(productIndex, 1);
      } else {
        // Cập nhật số lượng sản phẩm
        cart.products[productIndex].quantity = quantity;
      }

      // Nếu không còn sản phẩm nào trong giỏ hàng, xóa giỏ hàng
      if (cart.products.length === 0) {
        await cartModel.findByIdAndDelete(cart._id);
        return res.status(200).json({ message: "Cart emptied and deleted" });
      }

      // Tính tổng tiền
      cart.totalAmount = await calculateTotalAmount(cart.products);

      // Cập nhật giỏ hàng
      await cart.save();
      return res
        .status(200)
        .json({ message: "Cart updated successfully", cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update cart", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId, variantId } = req.body;

    // Tìm giỏ hàng của người dùng
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tìm chỉ số sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.variantId.toString() === variantId
    );

    if (productIndex > -1) {
      // Xóa sản phẩm khỏi giỏ hàng
      cart.products.splice(productIndex, 1);

      // Nếu không còn sản phẩm nào trong giỏ hàng, xóa giỏ hàng
      if (cart.products.length === 0) {
        await cartModel.findByIdAndDelete(cart._id);
        return res.status(200).json({ message: "Cart emptied and deleted" });
      }

      // Tính tổng tiền
      cart.totalAmount = await calculateTotalAmount(cart.products);

      // Cập nhật giỏ hàng
      await cart.save();
      return res
        .status(200)
        .json({ message: "Product removed from cart", cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
};
