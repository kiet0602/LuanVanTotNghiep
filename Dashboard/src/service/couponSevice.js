import axios from "axios";

export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/coupon/addCoupon`,
      couponData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error.response?.data);
    throw error;
  }
};

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/coupon/getAllCoupon`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error.response?.data);
    throw error;
  }
};

export const getCouponById = async (id) => {
  try {
    const response = await axios.get(`/api/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon:", error.response?.data);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/coupon/deleteCoupon/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting coupon:", error.response?.data);
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const response = await axios.put(
      `http://localhost:2000/api/coupon/updateCoupon/${id}`,
      couponData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating coupon:", error.response?.data);
    throw error;
  }
};

export const applyCoupon = async (couponData) => {
  try {
    const response = await axios.post("/api/coupons/apply", couponData);
    return response.data;
  } catch (error) {
    console.error("Error applying coupon:", error.response?.data);
    throw error;
  }
};

export const sendVoucherEmail = async (userId, couponId) => {
  try {
    const response = await axios.post(
      "http://localhost:2000/api/coupon/send-coupon",
      { userId, couponId }
    );
    return response.data; // Hoặc xử lý dữ liệu phản hồi theo nhu cầu của bạn
  } catch (error) {
    console.error("Error sending voucher email:", error.response.data);
    throw error; // Ném lỗi lên để xử lý ở nơi gọi
  }
};
