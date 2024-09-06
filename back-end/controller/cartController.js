import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Chuyển đổi quantity thành số nguyên và kiểm tra tính hợp lệ
  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }
  try {
    // Tìm giỏ hàng của người dùng
    let cart = await cartModel.findOne({ user: userId });
    // Nếu không tìm thấy giỏ hàng, tạo mới
    if (!cart) {
      cart = new cartModel({ user: userId, items: [], totalPrice: 0 });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    // Tính toán số lượng tổng cộng sẽ có trong giỏ hàng sau khi thêm
    let totalQuantityInCart = parsedQuantity;
    if (existingItem) {
      // Đảm bảo existingItem.quantity là số nguyên
      const existingQuantity = Number.isInteger(existingItem.quantity)
        ? existingItem.quantity
        : parseInt(existingItem.quantity, 10);

      totalQuantityInCart += existingQuantity;
    }

    // Kiểm tra xem số lượng tổng cộng có lớn hơn số lượng tồn kho không
    if (totalQuantityInCart > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    // Nếu sản phẩm đã có trong giỏ hàng, cộng thêm số lượng
    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      // Nếu chưa có, thêm sản phẩm vào giỏ hàng
      cart.items.push({ product: productId, quantity: parsedQuantity });
    }

    // Cập nhật tổng giá của giỏ hàng
    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const itemProduct = await productModel.findById(item.product);
        return itemProduct.finalPrice * item.quantity;
      })
    );

    cart.totalPrice = updatedItems.reduce((total, price) => total + price, 0);

    // Lưu giỏ hàng
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {
      // Xóa giỏ hàng nếu không còn sản phẩm
      await cartModel.deleteOne({ user: userId });
      return res.status(200).json({ message: "Giỏ hàng đã được xóa" });
    }

    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const itemProduct = await productModel.findById(item.product);
        return itemProduct.finalPrice * item.quantity;
      })
    );

    cart.totalPrice = updatedItems.reduce((total, price) => total + price, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
const updateItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Chuyển đổi quantity thành số nguyên và kiểm tra tính hợp lệ
  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    // Tìm giỏ hàng của người dùng
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    // Tính toán số lượng tổng cộng sau khi cập nhật
    const totalQuantityInCart =
      parsedQuantity + (existingItem.quantity - parsedQuantity);

    // Kiểm tra xem số lượng tổng cộng có lớn hơn số lượng tồn kho không
    if (totalQuantityInCart > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    existingItem.quantity = parsedQuantity;

    // Cập nhật tổng giá của giỏ hàng
    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const itemProduct = await productModel.findById(item.product);
        return itemProduct.finalPrice * item.quantity;
      })
    );

    cart.totalPrice = updatedItems.reduce((total, price) => total + price, 0);

    // Lưu giỏ hàng
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
const getCartById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export { addToCart, removeFromCart, updateItemQuantity, getCartById };
