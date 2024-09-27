import axios from "axios";
// Hàm để gọi API lấy tất cả đơn hàng và tổng doanh thu
export const getRevenue = async () => {
  try {
    const response = await axios.get(
      "http://localhost:2000/api/checkout/getRevenue"
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching orders and revenue:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

// Hàm để gọi API lấy doanh thu theo tháng
export const getMonthlyRevenue = async () => {
  try {
    // Gọi API từ backend để lấy doanh thu theo tháng
    const response = await axios.get(
      "http://localhost:2000/api/checkout/getMonthlyRevenue"
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};
export const getQuantitySalesByCategory = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/checkout/getQuantitySalesByCategory`
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

// Hàm cập nhật đơn hàng
export const updateOrder = async (orderId, updates) => {
  try {
    const response = await axios.put(
      `http://localhost:2000/api/checkout/updateCheckOut/${orderId}`,
      updates
    );
    return response.data; // Đơn hàng sau khi được cập nhật
  } catch (error) {
    throw new Error(error.response.data.message || "Lỗi cập nhật đơn hàng");
  }
};

// Hàm xóa đơn hàng
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/checkout/deleteCheckOut/${orderId}`
    );
    return response.data; // Thông báo xóa thành công
  } catch (error) {
    throw new Error(error.response.data.message || "Lỗi xóa đơn hàng");
  }
};

// Hàm lấy đơn hàng theo ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/checkout/checkOutByIdOrder/${orderId}`
    );
    return response.data; // Thông tin chi tiết đơn hàng
  } catch (error) {
    throw new Error(
      error.response.data.message || "Lỗi lấy thông tin đơn hàng"
    );
  }
};

// Hàm lấy tất cả đơn hàng
export const getAllOrders = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/checkout/getAllOrders`
    );
    return response.data; // Danh sách tất cả đơn hàng
  } catch (error) {
    throw new Error(
      error.response.data.message || "Lỗi lấy danh sách đơn hàng"
    );
  }
};
