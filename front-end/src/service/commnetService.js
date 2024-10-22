import axios from "axios";

// Thêm bình luận hoặc phản hồi
export const addComment = async (productId, parentId, content, rating) => {
  try {
    const token = localStorage.getItem("token"); // Giả sử token lưu trong localStorage
    const response = await axios.post(
      `http://localhost:2000/api/comment/products/${productId}/comments${
        parentId ? `/${parentId}` : ""
      }`,
      // Chỉ gửi rating nếu không có parentId (bình luận cha)
      {
        content,
        ...(parentId ? {} : { rating }), // Nếu có parentId, không gửi rating
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Xóa bình luận
export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Cập nhật bình luận
export const updateComment = async (commentId, content, rating) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/comments/${commentId}`,
      { content, rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Lấy danh sách bình luận theo sản phẩm
export const getCommentsByProduct = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/comment/products/${productId}/comments/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
