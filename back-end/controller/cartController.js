import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId, items: [], totalPrice: 0 });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    let totalQuantityInCart = parsedQuantity;
    if (existingItem) {
      totalQuantityInCart += existingItem.quantity;
    }

    if (totalQuantityInCart > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    const itemPrice =
      product.originalPrice - (product.originalPrice * product.discount) / 100;
    const totalItemPrice = itemPrice * parsedQuantity;

    if (existingItem) {
      existingItem.quantity += parsedQuantity;
      existingItem.totalPriceItemCart = itemPrice * existingItem.quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: parsedQuantity,
        totalPriceItemCart: totalItemPrice,
      });
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

    // Tìm sản phẩm
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

    // Kiểm tra số lượng tồn kho
    if (parsedQuantity > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    // Cập nhật số lượng sản phẩm
    existingItem.quantity = parsedQuantity;

    // Cập nhật totalPriceItemCart cho từng sản phẩm
    for (let item of cart.items) {
      const itemProduct = await productModel.findById(item.product);
      item.totalPriceItemCart = itemProduct.finalPrice * item.quantity;
    }

    // Tính lại tổng giá của giỏ hàng
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.totalPriceItemCart,
      0
    );

    // Lưu giỏ hàng đã cập nhật
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getCartById = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const updatedItems = cart.items.map((item) => {
      const product = item.product;

      if (!product || !product.originalPrice) {
        return item;
      }

      const discount = product.discount || 0;
      const finalPrice =
        product.originalPrice - (product.originalPrice * discount) / 100;

      const totalItemPrice = finalPrice * item.quantity;

      return {
        ...item._doc,
        product: {
          ...product._doc,
          finalPrice,
        },
        totalItemPrice,
      };
    });

    cart.items = updatedItems;

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export { addToCart, removeFromCart, updateItemQuantity, getCartById };
