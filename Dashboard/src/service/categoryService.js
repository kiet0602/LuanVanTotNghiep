import axios from "axios";

// Thêm danh mục mới

const addCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append("categoryName", categoryData.categoryName);
    formData.append("descriptionCategory", categoryData.descriptionCategory);
    formData.append("classification", categoryData.classification);
    formData.append("imageCategory", categoryData.imageCategory); // Hình ảnh được chọn từ input file

    const response = await axios.post(
      `http://localhost:2000/api/category/addCategory`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Lỗi khi thêm danh mục!";
    throw new Error(message);
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/category/getCategoryById/${id}`
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Lỗi khi lấy danh mục!";
    throw new Error(message);
  }
};

// Lấy tất cả danh mục
const getAllCategories = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/category/getAllCategory`
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lỗi khi lấy danh sách danh mục!";
    throw new Error(message);
  }
};

// Xóa danh mục
const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:2000/api/category/deleteCategory/${id}`
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Lỗi khi xóa danh mục!";
    throw new Error(message);
  }
};

// Cập nhật danh mục
const updateCategory = async (id, categoryData) => {
  try {
    const formData = new FormData();
    formData.append("categoryName", categoryData.categoryName);
    formData.append("descriptionCategory", categoryData.descriptionCategory);
    formData.append("classification", categoryData.classification);

    // Chỉ thêm imageCategory nếu nó tồn tại (không phải null)
    if (categoryData.imageCategory) {
      formData.append("imageCategory", categoryData.imageCategory);
    }

    const response = await axios.put(
      `http://localhost:2000/api/category/updateCategory/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Thiết lập header cho FormData
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Lỗi khi cập nhật danh mục!";
    throw new Error(message);
  }
};

// Lấy danh mục theo phân loại
// const getCategoriesByClassification = async (classificationId) => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/classification/${classificationId}`
//     );
//     return response.data;
//   } catch (error) {
//     const message =
//       error.response?.data?.message || "Lỗi khi lấy danh mục theo phân loại!";
//     throw new Error(message);
//   }
// };

export {
  addCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  updateCategory,
  //   getCategoriesByClassification,
};
