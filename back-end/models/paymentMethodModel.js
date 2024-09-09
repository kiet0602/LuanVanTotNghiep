import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên của phương thức thanh toán (ví dụ: "Credit Card", "PayPal")
  details: { type: String }, // Thông tin thêm về phương thức thanh toán
});

const paymentMethodModel = mongoose.model("PaymentMethod", paymentMethodSchema);

export default paymentMethodModel;
