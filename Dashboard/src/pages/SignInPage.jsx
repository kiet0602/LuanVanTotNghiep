import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Đảm bảo dùng đúng useNavigate

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook điều hướng của react-router-dom v6

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi API để đăng nhập
      const response = await axios.post(
        `http://localhost:2000/api/user/loginAdmin`,
        { email, password }
      );

      // Lưu token vào localStorage
      const { token } = response.data;
      localStorage.setItem("adminToken", token);

      // Thông báo thành công
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Điều hướng đến trang Overview
      window.location.href = "/"; // Dùng navigate thay vì window.location.href
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        toast.error(error.response.data.error || "Đăng nhập thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Lỗi kết nối hoặc lỗi khác
        toast.error("Không thể kết nối đến server. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Đăng nhập Admin
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
