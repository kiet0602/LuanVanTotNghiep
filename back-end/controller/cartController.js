import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
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

    // Tính toán tổng giá và các phí
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.totalPriceItemCart,
      0
    );
    cart.shippingFee = calculateShippingFee(cart.totalPrice);

    // Tính toán giá cuối cùng
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
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

    // Tính toán tổng giá và các phí
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.totalPriceItemCart,
      0
    );
    cart.shippingFee = calculateShippingFee(cart.totalPrice);

    // Tính toán giá cuối cùng
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    if (parsedQuantity > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    existingItem.quantity = parsedQuantity;
    existingItem.totalPriceItemCart =
      existingItem.quantity *
      (product.originalPrice -
        (product.originalPrice * product.discount) / 100);

    // Tính toán tổng giá và các phí
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.totalPriceItemCart,
      0
    );
    cart.shippingFee = calculateShippingFee(cart.totalPrice);

    // Tính toán giá cuối cùng
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm lấy giỏ hàng của người dùng
export const getCartById = async (req, res) => {
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
    cart.totalPrice = updatedItems.reduce(
      (acc, item) => acc + item.totalItemPrice,
      0
    );
    cart.shippingFee = calculateShippingFee(cart.totalPrice);
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm tính phí vận chuyển
function calculateShippingFee(totalPrice) {
  if (totalPrice > 300000) {
    return 0; // Miễn phí vận chuyển
  }
  return totalPrice * 0.05; // Ví dụ: 5% tổng giá nếu không miễn phí
}
