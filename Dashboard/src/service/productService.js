import axios from "axios";

// Hàm thêm sản phẩm với nhiều ảnh
export const addProduct = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:2000/api/product/addProduct",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

// Hàm lấy danh sách sản phẩm
export const getProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:2000/api/product/getAllProducts"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Hàm cập nhật sản phẩm
export const updateProduct = async (productId, productData, images) => {
  try {
    const formData = new FormData();

    // Thêm dữ liệu vào formData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Thêm ảnh nếu có
    if (images) {
      images.forEach((image) => {
        formData.append("image", image);
      });
    }

    const response = await axios.put(
      `http://localhost:2000/api/product/updateProduct/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Hàm xóa sản phẩm
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/product/deleteProduct/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Hàm lấy chi tiết sản phẩm theo ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/product/getProductById/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
