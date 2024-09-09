import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Giá của sản phẩm khi đặt hàng
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema], // Các sản phẩm trong đơn hàng
    totalPrice: { type: Number, required: true }, // Tổng giá của đơn hàng
    shippingFee: { type: Number, default: 0 }, // Phí vận chuyển
    shippingMethod: { type: String, required: true }, // Phương thức vận chuyển
    discount: { type: Number, default: 0 }, // Giảm giá áp dụng cho đơn hàng
    finalPrice: { type: Number, required: true }, // Giá cuối cùng của đơn hàng sau giảm giá
    shippingAddress: { type: String, required: true }, // Địa chỉ giao hàng
    paymentMethod: { type: String, required: true }, // Phương thức thanh toán
    status: {
      type: String,
      enum: [
        "Chờ xử lý",
        "Đang xử lý",
        "Đã giao hàng",
        "Đã nhận hàng",
        "Đã hủy",
      ],
      default: "Chờ xử lý",
    },
  },
  { timestamps: true }
); // Tự động thêm createdAt và updatedAt

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
