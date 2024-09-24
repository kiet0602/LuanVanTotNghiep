import axios from "axios";

// Tạo phân loại mới
export const createClassification = async (classificationName) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/classification/AddClassifications`,
      { classificationName }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy tất cả phân loại
export const getClassifications = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/classification/getAllClassifications`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy phân loại theo ID
export const getClassificationById = async (id) => {
  try {
    const response = await axios.get(
      `${`http://localhost:2000/api/classification/getClassifications/${id}`}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật phân loại theo ID
export const updateClassification = async (id, classificationName) => {
  try {
    const response = await axios.put(
      `${`http://localhost:2000/api/classification/updateClassifications/${id}`}`,
      {
        classificationName,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xóa phân loại theo ID
export const deleteClassification = async (id) => {
  try {
    const response = await axios.delete(
      `${`http://localhost:2000/api/classification/deleteClassifications/${id}`}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
