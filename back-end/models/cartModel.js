import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  totalPriceItemCart: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
  },
  shippingFee: { type: Number, default: 0 }, // Thêm phí giao hàng
  finalPrice: { type: Number, default: 0 }, // Tổng giá sau khi cộng phí và giảm giá
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model từ schema
const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
