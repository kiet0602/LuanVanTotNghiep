import axios from "axios";

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/cart/AddToCart`,
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (userId, productId) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/cart/deleteProductFromCart`,
      {
        userId,
        productId,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateItemQuantity = async (userId, productId, quantity) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/cart/updateProductFromCart`,
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Lấy giỏ hàng của người dùng
export const getCartById = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/cart/getProductFromCart/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
