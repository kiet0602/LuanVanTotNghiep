import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  nameColor: {
    type: String,
    required: true,
  },
  // Thêm các trường khác nếu cần
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ColorModel = mongoose.model("Color", colorSchema);

export default ColorModel;
