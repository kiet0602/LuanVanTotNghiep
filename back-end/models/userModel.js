import mongoose from "mongoose";
//không thể thay đổi tùy tiện, nếu muốn đổi phải xóa bảng trong app mongoose
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  numberPhone: {
    type: String,
    required: true,
    unique: true, // Đảm bảo số điện thoại là duy nhất
    trim: true, // Loại bỏ khoảng trắng thừa
  },
  role: {
    type: Boolean,
    default: false,
  },
  favoritesProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});
const userModel = mongoose.model("User", userSchema);

export default userModel;
