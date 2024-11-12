// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { toast } from "react-toastify";
// import { fetchUser } from "../service/userService";

// const ProtectedRoute = () => {

//   const [userCurrent, setUserCurrent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const getUserData = async () => {
//     try {
//       const response = await fetchUser();
//       setUserCurrent(response);
//     } catch (error) {
//       console.log(error.message);
//       toast.error("Không thể lấy dữ liệu người dùng.");
//       setUserCurrent(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);

//   // Chờ lấy dữ liệu người dùng xong
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   // Nếu không có thông tin người dùng, điều hướng đến trang đăng nhập
//   if (!userCurrent) {
//     return <Navigate to="/signIn" />;
//   }
//   // Nếu có thông tin người dùng, cho phép truy cập các route bên trong
//   return <Outlet />;
// };

// export default ProtectedRoute;
