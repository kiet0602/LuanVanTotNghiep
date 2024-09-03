import commentModel from "../models/commentModel.js";
import productModel from "../models/productModel.js";

export const addComment = async (req, res) => {
  try {
    const { productId, userId, rating, commentText } = req.body;

    // Tạo bình luận mới
    const newComment = new commentModel({
      product: productId,
      user: userId,
      rating,
      commentText,
    });

    // Lưu bình luận vào database
    await newComment.save();

    // Tìm sản phẩm và cập nhật ratingsCount và averageRating
    const product = await productModel.findById(productId);

    if (product) {
      // Cập nhật số lượng đánh giá và tính toán lại điểm trung bình
      product.ratingsCount += 1;
      product.averageRating =
        (product.averageRating * (product.ratingsCount - 1) + rating) /
        product.ratingsCount;

      // Lưu thay đổi vào database
      await product.save();
    }

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    // Tìm và xóa bình luận
    const comment = await commentModel.findByIdAndDelete(commentId);

    if (comment) {
      // Tìm sản phẩm tương ứng với bình luận
      const product = await productModel.findById(comment.product);

      if (product) {
        // Cập nhật số lượng đánh giá và tính toán lại điểm trung bình
        product.ratingsCount -= 1;

        if (product.ratingsCount > 0) {
          product.averageRating =
            (product.averageRating * (product.ratingsCount + 1) -
              comment.rating) /
            product.ratingsCount;
        } else {
          product.averageRating = 0; // Nếu không còn bình luận nào, đặt averageRating về 0
        }

        // Lưu thay đổi vào database
        await product.save();
      }

      return res.status(200).json({
        message: "Comment deleted successfully",
        comment: comment,
      });
    } else {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId, rating, commentText } = req.body;

    // Tìm bình luận cũ
    const oldComment = await commentModel.findById(commentId);

    if (oldComment) {
      // Tìm sản phẩm tương ứng
      const product = await productModel.findById(oldComment.product);
      if (product) {
        // Nếu có thay đổi rating, cập nhật lại averageRating
        if (rating && rating !== oldComment.rating) {
          product.averageRating =
            (product.averageRating * product.ratingsCount -
              oldComment.rating +
              rating) /
            product.ratingsCount;

          // Lưu thay đổi vào database
          await product.save();
        }
      }

      // Cập nhật bình luận
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { rating, commentText },
        { new: true }
      );

      return res.status(200).json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } else {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update comment",
      error: error.message,
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    // Lấy tất cả bình luận từ cơ sở dữ liệu
    const comments = await commentModel
      .find()
      .populate("product")
      .populate("user"); // Giả sử bạn muốn populate các trường product và user

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};
