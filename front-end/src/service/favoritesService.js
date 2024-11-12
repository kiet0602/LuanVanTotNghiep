import axios from "axios";
const token = localStorage.getItem("token");

// Thêm sản phẩm vào danh sách yêu thích
export const addFavoriteProduct = async (productId) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/favorites/users/favorite/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error adding product to favorites";
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavoriteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/favorites/users/favorite/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error removing product from favorites";
  }
};

// Lấy tất cả sản phẩm yêu thích của người dùng
export const getAllFavoriteProducts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/favorites/users/favorites`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error fetching favorite products";
  }
};
