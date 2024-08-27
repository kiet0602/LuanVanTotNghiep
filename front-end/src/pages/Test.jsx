import React, { useEffect, useState } from "react";
import axios from "axios";

const Test = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user");
        setUserData(response.data);
      } catch (err) {
        setError("Không thể lấy dữ liệu người dùng");
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {userData ? (
        <div>
          <h1>Hồ Sơ Người Dùng</h1>
          <p>
            <strong>Tên người dùng:</strong> {userData.username}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {userData.address?.street},{" "}
            {userData.address?.city}, {userData.address?.country}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {userData.phoneNumber}
          </p>
          <p>
            <strong>Vai trò:</strong> {userData.role}
          </p>
          {userData.avatar && (
            <img src={userData.avatar} alt="Ảnh đại diện của người dùng" />
          )}
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(userData.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Ngày cập nhật:</strong>{" "}
            {new Date(userData.updatedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default Test;
