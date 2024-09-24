import axios from "axios";

// Lấy tất cả màu sắc
export const getAllColors = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/color/getAllcolor`
    );
    return response.data; // Trả về danh sách màu sắc
  } catch (error) {
    throw new Error(error.response.data.msg || "Lỗi khi lấy màu sắc");
  }
};

// Lấy màu sắc theo ID
export const getColorById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/color/getColor/${id}`
    );
    return response.data; // Trả về màu sắc
  } catch (error) {
    throw new Error(error.response.data.msg || "Lỗi khi lấy màu sắc");
  }
};

// Tạo mới màu sắc
export const createColor = async (nameColor) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/color/AddColor`,
      { nameColor }
    );
    return response.data; // Trả về màu sắc vừa tạo
  } catch (error) {
    throw new Error(error.response.data.msg || "Lỗi khi tạo màu sắc");
  }
};

// Cập nhật màu sắc theo ID
export const updateColorById = async (id, nameColor) => {
  try {
    const response = await axios.put(
      `http://localhost:2000/api/color/updateColor/${id}`,
      nameColor
    );
    return response.data; // Trả về màu sắc đã cập nhật
  } catch (error) {
    throw new Error(error.response.data.msg || "Lỗi khi cập nhật màu sắc");
  }
};

// Xóa màu sắc theo ID
export const deleteColorById = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/color/deleteColor/${id}`
    );
    return response.data; // Trả về thông báo xóa thành công
  } catch (error) {
    throw new Error(error.response.data.msg || "Lỗi khi xóa màu sắc");
  }
};
