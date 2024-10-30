import axios from "axios";

export const getAllDiscountProducts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2000/api/product/getAllProductsDiscount`
    );
    return response.data;
  } catch (error) {
    throw error.response.data || "Error fetching favorite products";
  }
};
