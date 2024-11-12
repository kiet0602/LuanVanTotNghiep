import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.user; // Lấy userId từ thông tin người dùng đã được xác thực trong Auth middleware

  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    // Kiểm tra nếu giỏ hàng đã tồn tại
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      // Nếu không có giỏ hàng, tạo mới giỏ hàng
      cart = new cartModel({ user: userId, items: [], totalPrice: 0 });
    }

    // Kiểm tra sự tồn tại của sản phẩm
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    let totalQuantityInCart = parsedQuantity;
    if (existingItem) {
      totalQuantityInCart += existingItem.quantity;
    }

    // Kiểm tra số lượng sản phẩm trong kho
    if (totalQuantityInCart > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    // Tính giá sau giảm giá
    const itemPrice =
      product.originalPrice -
      (product.originalPrice * (product.discount || 0)) / 100;
    const totalItemPrice = itemPrice * parsedQuantity;

    // Nếu sản phẩm đã có trong giỏ, chỉ cập nhật số lượng và giá trị
    if (existingItem) {
      existingItem.quantity += parsedQuantity;
      existingItem.totalPriceItemCart = itemPrice * existingItem.quantity;
    } else {
      // Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm vào giỏ
      cart.items.push({
        product: productId,
        quantity: parsedQuantity,
        totalPriceItemCart: totalItemPrice,
      });
    }

    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.totalPriceItemCart,
      0
    );
    // Tính phí vận chuyển
    cart.shippingFee = calculateShippingFee(cart.totalPrice);
    // Tính giá cuối cùng (bao gồm phí vận chuyển)
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();

    // Trả về giỏ hàng đã cập nhật
    res.status(200).json(cart);
  } catch (error) {
    // Xử lý lỗi server
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.user; // Lấy userId từ thông tin người dùng đã xác thực trong Auth middleware

  try {
    // Tìm giỏ hàng của người dùng
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tìm chỉ mục sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // Nếu sản phẩm không có trong giỏ hàng
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items.splice(itemIndex, 1);

    // Nếu giỏ hàng không còn sản phẩm nào, xóa toàn bộ giỏ hàng
    if (cart.items.length === 0) {
      await cartModel.deleteOne({ user: userId });
      return res.status(200).json({ message: "Giỏ hàng đã được xóa" });
    }

    // Tính toán lại tổng giá trị giỏ hàng và phí vận chuyển
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.totalPriceItemCart,
      0
    );
    cart.shippingFee = calculateShippingFee(cart.totalPrice);

    // Tính toán giá cuối cùng
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    // Lưu lại giỏ hàng sau khi xóa sản phẩm
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.user; // Lấy userId từ thông tin người dùng đã xác thực trong Auth middleware

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

    // Kiểm tra sự tồn tại của sản phẩm
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra sản phẩm có trong giỏ hàng không
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    // Kiểm tra số lượng vượt quá tồn kho
    if (parsedQuantity > product.quantity) {
      return res.status(400).json({
        message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Số lượng có sẵn: ${product.quantity}`,
      });
    }

    // Cập nhật số lượng và tổng giá sản phẩm trong giỏ hàng
    existingItem.quantity = parsedQuantity;
    existingItem.totalPriceItemCart =
      existingItem.quantity *
      (product.originalPrice -
        (product.originalPrice * product.discount) / 100);

    // Tính toán lại tổng giá và các phí
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.totalPriceItemCart,
      0
    );
    cart.shippingFee = calculateShippingFee(cart.totalPrice);
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm lấy giỏ hàng của người dùng
// export const getCartById = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await cartModel
//       .findOne({ user: userId })
//       .populate("items.product");

//     if (!cart) {
//       return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
//     }

//     const updatedItems = cart.items
//       .filter((item) => item.product && item.product.quantity > 0) // Chỉ giữ lại các sản phẩm còn tồn kho
//       .map((item) => {
//         const product = item.product;

//         if (!product || !product.originalPrice) {
//           return item;
//         }

//         const discount = product.discount || 0;
//         const finalPrice =
//           product.originalPrice - (product.originalPrice * discount) / 100;

//         const totalItemPrice = finalPrice * item.quantity;

//         return {
//           ...item._doc,
//           product: {
//             ...product._doc,
//             finalPrice,
//           },
//           totalItemPrice,
//         };
//       });

//     cart.items = updatedItems;
//     cart.totalPrice = updatedItems.reduce(
//       (acc, item) => acc + item.totalItemPrice,
//       0
//     );
//     cart.shippingFee = calculateShippingFee(cart.totalPrice);
//     cart.finalPrice = cart.totalPrice + cart.shippingFee;

//     // Lưu giỏ hàng sau khi cập nhật các sản phẩm hết hàng
//     await cart.save();

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server", error });
//   }
// };

export const getCartById = async (req, res) => {
  const { userId } = req.user; // Lấy userId từ middleware Auth

  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const warnings = []; // Mảng lưu các thông báo cảnh báo

    const updatedItems = cart.items.map((item) => {
      const product = item.product;
      if (!product || !product.originalPrice) {
        return item; // Giữ lại sản phẩm với dữ liệu gốc nếu không có giá trị chính xác
      }

      let adjustedQuantity = item.quantity; // Giữ nguyên số lượng ban đầu
      if (product.quantity === 0) {
        warnings.push(`Sản phẩm "${product.name}" hiện đã hết hàng.`);
      } else if (item.quantity > product.quantity) {
        warnings.push(
          `Sản phẩm "${product.name}" chỉ còn ${product.quantity} sản phẩm trong kho.`
        );
        adjustedQuantity = product.quantity; // Điều chỉnh số lượng nếu vượt quá tồn kho
      }

      const discount = product.discount || 0;
      const finalPrice =
        product.originalPrice - (product.originalPrice * discount) / 100;
      const totalItemPrice = finalPrice * adjustedQuantity;

      return {
        ...item.toObject(),
        product: {
          ...product.toObject(),
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

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();

    res.status(200).json({
      cart,
      warnings, // Trả về danh sách cảnh báo
    });
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
