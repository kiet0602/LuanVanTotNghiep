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
