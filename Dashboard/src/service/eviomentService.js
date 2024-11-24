// services/environmentService.js
import axios from "axios";

// Lấy tất cả môi trường sống
export const getAllEnvironments = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/environment/getAllEnvironments`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch environments");
  }
};

// Lấy môi trường sống theo ID
export const getEnvironmentById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/environment/getEnvironments/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch environment by ID");
  }
};

// Tạo mới môi trường sống
export const createEnvironment = async (nameEnviroment) => {
  try {
    const response = await axios.post(
      `http://localhost:2000/api/environment/addEnvironments`,
      { nameEnviroment }
    );
    console.log(response);

    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Cập nhật môi trường sống theo ID
export const updateEnvironmentById = async (id, nameEnviroment) => {
  try {
    const response = await axios.put(
      `http://localhost:2000/api/environment/updateEnvironments/${id}`,
      nameEnviroment
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update environment");
  }
};

// Xóa môi trường sống theo ID
export const deleteEnvironmentById = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/environment/deleteEnvironments/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete environment");
  }
};
