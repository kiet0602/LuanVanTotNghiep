
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Để điều hướng

const Profile = () => {
  const [user, setUser] = useState(null);
  const tokenAdmin = localStorage.getItem("adminToken");
  const navigate = useNavigate(); // Dùng useNavigate thay vì window.location

  // Hàm đăng xuất
  const handleOut = () => {
    // Kiểm tra xem có tokenAdmin trong localStorage hay không
    if (tokenAdmin) {
      // Xóa tokenAdmin khỏi localStorage
      localStorage.removeItem("adminToken");
  
      // Sau khi xóa token, điều hướng người dùng đến trang đăng nhập
      navigate("/signIn"); // Dùng navigate để điều hướng
    }
  };

  // Hàm lấy dữ liệu người dùng
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/getUser`,
        {
          headers: {
            Authorization: `Bearer ${tokenAdmin}`, // Thêm token vào header
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Không thể lấy dữ liệu người dùng.");
    }
  };

  // Gọi fetchUser khi component mount hoặc tokenAdmin thay đổi
  useEffect(() => {
    if (tokenAdmin) {
      fetchUser();
    } else {
      navigate("/signIn"); // Điều hướng về trang đăng nhập nếu không có token
    }
  }, [tokenAdmin, navigate]);

  // Kiểm tra dữ liệu người dùng trước khi render
  if (!user) {
    return <p>Loading...</p>; // Hoặc một thông báo loading
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src="https://randomuser.me/api/portraits/men/3.jpg"
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {user.username}
          </h3>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      <button
        onClick={handleOut}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
      >
        Đăng xuất
      </button>
    </>
  );
};

export default Profile;
