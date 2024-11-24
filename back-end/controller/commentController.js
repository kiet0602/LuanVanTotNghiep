import commentModel from "../models/commentModel.js";
import productModel from "../models/productModel.js";

export const addComment = async (req, res) => {
  try {
    const { productId, parentId } = req.params;
    const { content, rating } = req.body;
    const { userId } = req.user;

    if (!parentId && (rating === undefined || rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Bạn phải nhập rating từ 1 đến 5!" });
    }

    // Tạo bình luận mới hoặc phản hồi
    const newComment = new commentModel({
      productId,
      userId,
      content,
      rating: parentId ? undefined : rating, // Nếu là phản hồi, không cần rating
      parentId: parentId || null, // Nếu là phản hồi, lưu parentId
    });

    await newComment.save();

    // Cập nhật sản phẩm tương ứng với bình luận
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Tăng số lượng đánh giá
    product.ratingsCount += 1;

    // Cập nhật rating trung bình nếu có rating
    if (parentId === null && rating !== undefined) {
      const totalRating =
        product.averageRating * (product.ratingsCount - 1) + rating;
      product.averageRating = totalRating / product.ratingsCount;
    }

    // Lưu sản phẩm đã cập nhật
    await product.save();

    if (parentId) {
      // Tìm bình luận cha (parentId) và đệ quy cập nhật
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }

      // Đệ quy thêm bình luận vào đúng cấp độ
      const addReplyRecursive = async (commentId, replyId) => {
        const comment = await commentModel.findById(commentId);
        if (comment) {
          // Nếu là bình luận cha cuối cùng, thêm phản hồi vào replies
          if (String(comment._id) === String(parentId)) {
            comment.replies.push(replyId);
            await comment.save();
          } else if (comment.replies.length > 0) {
            // Nếu vẫn có replies bên trong, tiếp tục đệ quy
            for (let reply of comment.replies) {
              await addReplyRecursive(reply, replyId);
            }
          }
        }
      };

      // Thêm phản hồi vào bình luận đệ quy
      await addReplyRecursive(parentId, newComment._id);
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).send("Bình luận không tồn tại");

    // Kiểm tra quyền sở hữu bình luận
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).send("Bạn không có quyền xóa bình luận này");
    }

    // Nếu là bình luận gốc, cập nhật sản phẩm
    if (!comment.parentId) {
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
    } else {
      // Nếu là phản hồi, xóa khỏi bình luận cha
      await commentModel.findByIdAndUpdate(comment.parentId, {
        $pull: { replies: commentId },
      });
    }

    // Xóa tất cả bình luận con (bao gồm phản hồi)
    await commentModel.deleteMany({ parentId: commentId });

    // Xóa bình luận hoặc phản hồi
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
    const userId = req.userId;

    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).send("Bình luận không tồn tại");

    // Kiểm tra quyền sở hữu bình luận
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).send("Bạn không có quyền cập nhật bình luận này");
    }

    // Nếu là bình luận gốc và có rating
    if (!comment.parentId && rating !== undefined) {
      const product = await productModel.findById(comment.productId);
      if (!product) return res.status(404).send("Sản phẩm không tồn tại");

      const oldRating = comment.rating;
      const totalRatings = product.ratingsCount;

      const updatedAverageRating =
        totalRatings > 1
          ? (product.averageRating * totalRatings - oldRating + rating) /
            totalRatings
          : rating; // Nếu chỉ còn 1 đánh giá thì average sẽ là rating hiện tại

      await productModel.findByIdAndUpdate(comment.productId, {
        $set: { averageRating: updatedAverageRating },
      });
    }

    // Cập nhật nội dung
    comment.content = content;
    if (rating !== undefined) comment.rating = rating;

    await comment.save();

    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy tất cả bình luận của sản phẩm với thông tin người dùng và bình luận con
    const comments = await commentModel
      .find({ productId, parentId: null }) // Chỉ lấy bình luận gốc
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "username avatar",
        },
      });

    // Lấy tất cả các phản hồi lồng nhau
    for (let comment of comments) {
      comment.replies = await commentModel
        .find({ parentId: comment._id }) // Lấy phản hồi cho từng bình luận
        .populate({
          path: "userId",
          select: "username avatar",
        })
        .populate({
          path: "replies",
          populate: {
            path: "userId",
            select: "username avatar",
          },
        });
    }

    if (!comments || comments.length === 0)
      return res.status(404).send("Không có bình luận nào");

    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
