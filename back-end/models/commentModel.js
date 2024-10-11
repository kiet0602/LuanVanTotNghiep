import mongoose from "mongoose";

// Schema cho bình luận
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
    required: function () {
      return this.parentId == null; // Chỉ bắt buộc nếu không có parentId (là bình luận gốc)
    },
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", // Tham chiếu đến comment gốc để hỗ trợ bình luận lồng nhau
    default: null,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Tham chiếu đến chính nó để tạo bình luận lồng nhau
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model cho bình luận
const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
