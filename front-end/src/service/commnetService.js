import axios from "axios";

// Thay thế bằng URL cơ sở API thực tế của bạn

export const addComment = async (productId, content, rating, token) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/comment/products/${productId}/comments`,
      { content, rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Đã xảy ra lỗi khi thêm bình luận."
    );
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/comment/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Đã xảy ra lỗi khi xóa bình luận.");
  }
};

export const updateComment = async (commentId, content, rating, token) => {
  try {
    const response = await axios.put(
      `http://localhost:2000/api/comment/comments/${commentId}`,
      { content, rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Đã xảy ra lỗi khi cập nhật bình luận."
    );
  }
};

export const getCommentsByProduct = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/comment/products/${productId}/comments`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Đã xảy ra lỗi khi lấy bình luận.");
  }
};
