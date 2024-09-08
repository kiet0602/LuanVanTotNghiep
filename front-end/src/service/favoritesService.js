import axios from "axios";

// Thêm sản phẩm vào danh sách yêu thích
export const addFavoriteProduct = async (userId, productId) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/favorites/users/${userId}/favorite/${productId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error adding product to favorites";
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavoriteProduct = async (userId, productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/favorites/users/${userId}/favorite/${productId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error removing product from favorites";
  }
};

// Lấy tất cả sản phẩm yêu thích của người dùng
export const getAllFavoriteProducts = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/favorites/users/${userId}/favorites`
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error fetching favorite products";
  }
};
