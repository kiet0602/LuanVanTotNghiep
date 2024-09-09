import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import couponModel from "../models/couponModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Hàm xử lý checkout
export const checkout = async (req, res) => {
  const { userId, couponCode = null, shippingMethod, paymentMethod } = req.body;

  try {
    // 1. Lấy giỏ hàng của người dùng
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // 2. Lấy thông tin người dùng
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Lấy địa chỉ từ người dùng
    const shippingAddress = `${user.ward}, ${user.district}, ${user.city}`;

    // 3. Xử lý mã khuyến mãi (nếu có)
    let discount = 0;
    if (couponCode) {
      const coupon = await couponModel.findOne({ code: couponCode });

      if (coupon) {
        // Kiểm tra tính hợp lệ của mã giảm giá
        if (!coupon.isActive) {
          return res
            .status(400)
            .json({ message: "Mã giảm giá không còn hoạt động" });
        }
        if (coupon.expirationDate <= Date.now()) {
          return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
        }

        if (cart.totalPrice < coupon.minimumPurchaseAmount) {
          return res
            .status(400)
            .json({ message: "Số tiền mua chưa đủ để sử dụng mã giảm giá" });
        }

        // Tính toán giảm giá
        discount = (cart.totalPrice * coupon.discountPercentage) / 100;

        // Cập nhật số lần sử dụng của mã giảm giá
        coupon.usageCount += 1;

        try {
          await coupon.save(); // Lưu thay đổi
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Lỗi khi cập nhật mã giảm giá" });
        }
      } else {
        return res.status(400).json({ message: "Mã giảm giá không hợp lệ" });
      }
    }

    // 4. Tạo đơn hàng
    const finalPrice = cart.totalPrice + cart.shippingFee - discount;
    const order = new orderModel({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.totalPriceItemCart / item.quantity, // Giá từng sản phẩm
      })),
      totalPrice: cart.totalPrice,
      shippingFee: cart.shippingFee,
      shippingMethod: shippingMethod, // Thêm phương thức vận chuyển
      discount: discount,
      finalPrice: finalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod, // Ví dụ, thay đổi theo phương thức thanh toán thực tế
      status: "Chờ xử lý",
    });

    await order.save();

    // 5. Xóa giỏ hàng sau khi checkout
    await cartModel.findOneAndDelete({ user: userId });

    // 6. Cập nhật số lượng sản phẩm
    for (const item of cart.items) {
      await productModel.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: -item.quantity, orderCount: item.quantity },
      });
    }

    res.status(201).json({ message: "Checkout thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updates = req.body;

  try {
    // Kiểm tra các trường hợp hợp lệ cho giá cuối cùng
    if (updates.finalPrice !== undefined && updates.finalPrice < 0) {
      return res.status(400).json({ message: "Giá cuối cùng không hợp lệ" });
    }

    // Kiểm tra trạng thái hợp lệ
    if (updates.status !== undefined) {
      const validStatuses = [
        "Chờ xử lý",
        "Đang xử lý",
        "Đã giao hàng",
        "Đã nhận hàng",
        "Đã hủy",
      ];
      if (!validStatuses.includes(updates.status)) {
        return res
          .status(400)
          .json({ message: "Trạng thái đơn hàng không hợp lệ" });
      }
    }

    // Cập nhật đơn hàng theo ID
    const order = await orderModel.findByIdAndUpdate(orderId, updates, {
      new: true, // Trả về đơn hàng đã được cập nhật
    });

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Lấy đơn hàng theo ID và populate toàn bộ thông tin người dùng
    const order = await orderModel.findById(orderId).populate("user"); // Populate toàn bộ thông tin của người dùng

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm lấy danh sách đơn hàng của người dùng
export const getOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Lấy tất cả đơn hàng của người dùng và populate toàn bộ thông tin người dùng và sản phẩm
    const orders = await orderModel.find({ user: userId }).populate("user"); // Populate toàn bộ thông tin của user

    if (orders.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // Lấy tất cả các đơn hàng và populate thông tin người dùng và sản phẩm
    const orders = await orderModel.find().populate("user"); // Populate thông tin người dùng

    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
