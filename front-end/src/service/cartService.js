import axios from "axios";

const token = localStorage.getItem("token");

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/cart/AddToCart`,
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (productId) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/cart/deleteProductFromCart`,
      {
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateItemQuantity = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/cart/updateProductFromCart`,
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Lấy giỏ hàng của người dùng
export const getCartById = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/cart/getProductFromCart`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
