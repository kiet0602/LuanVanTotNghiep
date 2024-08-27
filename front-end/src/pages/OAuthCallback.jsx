import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Retrieve the token from the URL parameters

  // Function to fetch user information using the token
  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token correctly
        },
      });
      console.log("User info fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user info:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const userInfo = await fetchUserInfo(token);
          localStorage.setItem("jwt", token);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          toast.success("Đăng nhập thành công!");
          navigate("/");
        } catch (error) {
          toast.error("Đăng nhập thất bại! Vui lòng thử lại sau.");
          navigate("/signIn");
        }
      } else {
        toast.error("Không tìm thấy token trong URL!");
        navigate("/signIn");
      }
    };

    fetchData();
  }, [token, navigate]); // Dependencies: re-run the effect if the token or navigate changes

  return <div>Processing...</div>; // Display a loading message while processing
};

export default OAuthCallback;
