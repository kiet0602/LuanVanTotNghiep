import axios from "axios";
import { useState } from "react";

export const fetchUser = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`http://localhost:2000/api/user/getUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // nếu bạn sử dụng JWT
      },
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};
