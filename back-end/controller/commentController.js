import commentModel from "../models/commentModel.js";
import productModel from "../models/productModel.js";

export const addComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content, rating } = req.body;
    const { userId } = req.user;

    // Tạo bình luận mới
    const comment = new commentModel({ productId, userId, content, rating });
    await comment.save();

    // Cập nhật sản phẩm để tăng số lượng bình luận và cập nhật số lượng đánh giá và điểm trung bình
    const product = await productModel.findById(productId);
    if (product) {
      const totalRatings = product.ratingsCount + 1;
      const updatedAverageRating =
        (product.averageRating * product.ratingsCount + rating) / totalRatings;

      await productModel.findByIdAndUpdate(productId, {
        $push: { comments: comment._id },
        $inc: { ratingsCount: 1 },
        $set: { averageRating: updatedAverageRating },
      });
    }

    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Controller để xóa bình luận
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId; // Lấy userId từ middleware xác thực

    // Tìm và xóa bình luận
    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).send("Bình luận không tồn tại");

    // Kiểm tra quyền sở hữu bình luận
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).send("Bạn không có quyền xóa bình luận này");
    }

    // Lấy thông tin sản phẩm để cập nhật số lượng bình luận và điểm trung bình
    const product = await productModel.findById(comment.productId);
    if (product) {
      const totalRatings = product.ratingsCount - 1;
      const updatedAverageRating =
        totalRatings > 0
          ? (product.averageRating * product.ratingsCount - comment.rating) /
            totalRatings
          : 0;

      await productModel.findByIdAndUpdate(comment.productId, {
        $pull: { comments: commentId },
        $inc: { ratingsCount: -1 },
        $set: { averageRating: updatedAverageRating },
      });
    }

    // Xóa bình luận
    await commentModel.findByIdAndDelete(commentId);

    res.status(200).send({ message: "Bình luận đã được xóa" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;
    const userId = req.userId; // Lấy userId từ middleware xác thực

    // Tìm bình luận cần cập nhật
    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).send("Bình luận không tồn tại");

    // Kiểm tra quyền sở hữu bình luận
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).send("Bạn không có quyền cập nhật bình luận này");
    }

    // Tìm sản phẩm liên quan
    const product = await productModel.findById(comment.productId);
    if (!product) return res.status(404).send("Sản phẩm không tồn tại");

    // Tính toán sự thay đổi của điểm đánh giá trung bình
    const oldRating = comment.rating;
    const totalRatings = product.ratingsCount;
    const updatedAverageRating =
      (product.averageRating * totalRatings - oldRating + rating) /
      totalRatings;

    // Cập nhật bình luận
    comment.content = content;
    comment.rating = rating;
    await comment.save();

    // Cập nhật sản phẩm
    await productModel.findByIdAndUpdate(comment.productId, {
      $set: { averageRating: updatedAverageRating },
    });

    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Controller để lấy tất cả bình luận của một sản phẩm
// Controller để lấy tất cả bình luận của một sản phẩm
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy tất cả bình luận của sản phẩm với thông tin người dùng
    const product = await productModel.findById(productId).populate({
      path: "comments",
      populate: {
        path: "userId", // Assuming comments have a reference to a user
        select: "username avatar", // Include user name, image, and ID
      },
    });

    if (!product) return res.status(404).send("Sản phẩm không tồn tại");

    res.status(200).send(product.comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
