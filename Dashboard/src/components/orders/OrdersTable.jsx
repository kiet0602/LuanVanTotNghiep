import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search } from "lucide-react";
import Pagination from "../pagination/Pagination";
import { deleteOrder, getAllOrders } from "../../service/orderService";
import { format } from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";
import UpdateOrderModal from "../update/UpdateOrderModel";
import { toast } from "react-toastify";
import CheckBill from "../watch/CheckBill";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const PRODUCTS_PER_PAGE = 10;

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenSeeBill, setIsOpenSeeBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại

  const exportToExcel = () => {
    // Tạo một workbook mới
    const wb = XLSX.utils.book_new();

    // Chuyển đổi dữ liệu thành định dạng mà XLSX có thể sử dụng
    const wsData = orders.map((order) => ({
      "ID đơn hàng": order._id,
      "Tên khách hàng": order.user?.username || "",
      "Số tiền": order.finalPrice.toLocaleString("vi-VN") + " Đ",
      "Trạng thái": order.status,
      "Ngày đặt": order.createdAt
        ? format(new Date(order.createdAt), "dd-MM-yyyy")
        : "",
    }));

    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(wsData);

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Xuất file Excel
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const fetchOrders = async () => {
    try {
      const OrderData = await getAllOrders();
      setOrders(OrderData); // Lưu danh sách người dùng vào state
      setFilteredOrders(OrderData);
      console.log(OrderData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-yellow-500"; // Màu vàng
      case "Đang xử lý":
        return "bg-blue-500"; // Màu xanh dương
      case "Đã giao hàng":
        return "bg-green-500"; // Màu xanh lá
      case "Đã nhận hàng":
        return "bg-purple-500"; // Màu tím
      case "Đã hủy":
        return "bg-red-500"; // Màu đỏ
      default:
        return "bg-gray-500"; // Màu xám cho các trạng thái không xác định
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentOrder = filteredOrders.slice(offset, offset + PRODUCTS_PER_PAGE);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter(
      (order) =>
        order.user.username.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.shippingMethod.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredOrders].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredOrders(sorted);
  };

  const handleDeleteOrder = async (orderId) => {
    const orderToDelete = orders.find((item) => item._id === orderId);
    if (!orderToDelete) {
      toast.error("Không tìm thấy đơn hàng muốn xóa!");
    }
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa ${orderToDelete._id} ?`
    );
    if (!confirmed) return; // Nếu người dùng không xác nhận, dừng lại
    try {
      await deleteOrder(orderId);
      // Có thể cập nhật lại trạng thái để loại bỏ đơn hàng đã xóa khỏi giao diện
      setOrders(orders.filter((order) => order._id !== orderId));
      setFilteredOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.log(error.message);
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  };

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center justify-between mb-4 ">
          <h2 className="text-xl font-semibold text-black">
            Danh sách đơn hàng
          </h2>
          <button
            onClick={exportToExcel}
            className="text-green-500 hover:text-green-400 bg-black p-1 ml-3"
          >
            Xuất Excel
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
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
                { label: "ID đơn hàng", key: "_id" },
                { label: "Tên khách hàng", key: "user.username" },
                { label: "Số tiền", key: "finalPrice" },
                { label: "Trạng thái", key: "status" },
                { label: "Ngày đặt", key: "createdAt" },
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
            {currentOrder.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center">
                  {order?._id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">
                    {order?.user?.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">
                    {" "}
                    {order?.finalPrice?.toLocaleString("vi-VN")} Đ
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Thêm màu sắc theo trạng thái */}
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order?.status
                    )} text-white`}
                  >
                    {order?.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-blue-100">
                    {order?.createdAt
                      ? format(new Date(order.createdAt), "dd-MM-yyyy")
                      : ""}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2 "
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOpenUpdate(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 mr-2"
                    onClick={() => handleDeleteOrder(order._id)} // Sửa ở đây
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="text-green-400 hover:text-green-300">
                    <Eye
                      size={18}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOpenSeeBill(true);
                      }}
                    />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination
          pageCount={Math.ceil(filteredOrders.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>

      <UpdateOrderModal
        fetchOrders={fetchOrders}
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        order={selectedOrder}
      />
      <CheckBill
        order={selectedOrder}
        isOpenSeeBill={isOpenSeeBill}
        setIsOpenSeeBill={setIsOpenSeeBill}
      />
    </motion.div>
  );
};

export default OrdersTable;
