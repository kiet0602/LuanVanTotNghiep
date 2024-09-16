import axios from "axios";

const API_URL = "http://localhost:2000/api/fillter/fillter";

export const fetchFilteredProducts = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
