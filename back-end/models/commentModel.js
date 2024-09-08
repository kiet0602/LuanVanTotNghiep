import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1, // Điểm đánh giá thấp nhất là 1
    max: 5, // Điểm đánh giá cao nhất là 5
    required: true, // Bạn có thể thay đổi trường này thành không bắt buộc nếu cần
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
