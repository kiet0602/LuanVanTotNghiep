import mongoose from "mongoose";

// Định nghĩa schema cho Category
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
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
