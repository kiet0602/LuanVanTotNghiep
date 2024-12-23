import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Các trường hiện tại
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  care: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Environment",
    required: true,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  video: {
    type: String, // Nếu mỗi sản phẩm có một video, dùng String; hoặc đổi thành Array nếu có nhiều video
    required: false, // Đặt là false để video không bắt buộc
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // Khuyến mãi mặc định là 0%
  },
  size: {
    type: String,
    required: true,
  },
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
  favoriteCount: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual("finalPrice").get(function () {
  return this.originalPrice * (1 - this.discount / 100);
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
