import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
  characteristic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Characteristic",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model từ schema
const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
