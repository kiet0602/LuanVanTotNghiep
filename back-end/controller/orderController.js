import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import couponModel from "../models/couponModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Hàm xử lý checkout
export const checkout = async (req, res) => {
  const { userId, couponCode = null } = req.body;

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
      discount: discount,
      finalPrice: finalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: "Credit Card", // Ví dụ, thay đổi theo phương thức thanh toán thực tế
      status: "Pending",
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
