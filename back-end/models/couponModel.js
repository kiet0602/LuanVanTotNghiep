import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, default: 0 }, // Giảm giá phần trăm
  startDate: { type: Date, required: true }, // Ngày bắt đầu của mã khuyến mãi
  expirationDate: { type: Date, required: true }, // Ngày hết hạn của mã khuyến mãi
  minimumPurchaseAmount: { type: Number, default: 0 }, // Số tiền mua tối thiểu để áp dụng mã khuyến mãi
  isActive: { type: Boolean, default: true }, // Tình trạng hoạt động của mã khuyến mãi
  maxUsage: { type: Number, default: 0 }, // Số lần sử dụng tối đa của mã khuyến mãi, 0 có nghĩa là không giới hạn
  usageCount: { type: Number, default: 0 }, // Số lần đã sử dụng mã khuyến mãi
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;
