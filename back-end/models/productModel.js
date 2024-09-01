import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Tham chiếu đến model Category
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Environment", // Tham chiếu đến model Environment
    required: true,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color", // Tham chiếu đến model Color
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant", // Tham chiếu đến mô hình Variant
    },
  ],
  ratingsCount: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
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
const productModel = mongoose.model("Product", productSchema);

export default productModel;
