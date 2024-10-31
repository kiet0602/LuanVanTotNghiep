import axios from "axios";

export const getUser = async (id) => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data; // Trả về thông tin người dùng (không bao gồm mật khẩu)
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    throw error; // Ném lỗi để có thể xử lý ở component
  }
};
export const getAllUsers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:2000/api/user/getAllUser"
    );
    return response.data; // Trả về danh sách người dùng (không bao gồm mật khẩu)
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    throw error;
  }
};

export const updateUser = async (updateData, file = null) => {
  try {
    const formData = new FormData();
    // Thêm các trường thông tin cần cập nhật vào formData
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    // Nếu có file avatar thì thêm vào formData
    if (file) {
      formData.append("avatar", file);
    }
    const response = await axios.put("/api/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Chỉ định kiểu dữ liệu là form-data
      },
    });
    return response.data; // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    throw error;
  }
};

export const getAllUsersWithOrderStatus = async () => {
  try {
    const response = await axios.get(
      "http://localhost:2000/api/user/UsersOrderedAndNoOrder"
    );
    return response.data; // Trả về danh sách người dùng (không bao gồm mật khẩu)
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    throw error;
  }
};
