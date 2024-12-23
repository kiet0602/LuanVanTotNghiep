import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Pagination from "../pagination/Pagination";
import { getAllUsers } from "../../service/userService";
import SendVoucher from "../Send/SendVoucher";

const PRODUCTS_PER_PAGE = 10;

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [isOpenSendVoucher, setIsOpenSendVoucher] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData); // Lưu danh sách người dùng vào state
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentUsers = filteredUsers.slice(offset, offset + PRODUCTS_PER_PAGE);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(term) ||
        (user.email?.toLowerCase() || "").includes(term) ||
        (user.numberPhone?.toLowerCase() || "").includes(term) ||
        (user.ward?.toLowerCase() || "").includes(term) ||
        (user.district?.toLowerCase() || "").includes(term) ||
        (user.city?.toLowerCase() || "").includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sorted);
  };
  useEffect(() => {
    fetchUsers();
  }, [users.length]);
  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Người dùng</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="bg-gray-300 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[
                { label: "Tên người dùng", key: "username" },
                { label: "Email", key: "email" },
                { label: "Vai trò", key: "role" },
                { label: "Số điện thoại", key: "numberPhone" },
                { label: "Tiền đã chi", key: "totalAmountSpent" },
                {
                  label: "Đã mua",
                  key: "totalProductsPurchased",
                },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  {label}
                  {sortConfig.key === key ? (
                    <span
                      className={`ml-2 ${
                        sortConfig.direction === "asc"
                          ? "text-blue-400"
                          : "text-red-400"
                      }`}
                    >
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  ) : null}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentUsers.map((user, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center">
                  <img
                    src={
                      user?.avatar
                        ? `http://localhost:2000/images/${user.avatar}`
                        : "https://via.placeholder.com/40"
                    }
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {user?.username}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user?.role
                        ? "bg-red-800 text-red-100"
                        : "bg-blue-800 text-blue-100"
                    }`}
                  >
                    {user?.role ? "Admin" : "Khách hàng"}{" "}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{user?.numberPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-blue-100">
                    {user?.totalAmountSpent.toLocaleString("vi-VN")} Đ
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-blue-100">
                    {user?.totalProductsPurchased}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-blue-900 font-bold hover:text-indigo-300 mr-2 bg-slate-200 rounded-lg text-xs p-1"
                    onClick={() => {
                      setIsOpenSendVoucher(true);
                      setSelectedUser(user);
                    }}
                  >
                    Tặng khuyến mãi
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination
          pageCount={Math.ceil(filteredUsers.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>
      <SendVoucher
        isOpenSendVoucher={isOpenSendVoucher}
        setIsOpenSendVoucher={setIsOpenSendVoucher}
        user={selectedUser}
      />
    </motion.div>
  );
};

export default UsersTable;
