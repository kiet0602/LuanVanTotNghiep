import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Delete, Edit, Plus, Search, Trash2 } from "lucide-react";
import Pagination from "../pagination/Pagination";
import { deleteCoupon, getAllCoupons } from "../../service/couponSevice";
import AddCoupon from "../add/AddCoupon";
import UpdateCoupon from "../update/UpdateCouponModal";
import { toast } from "react-toastify";

const COUPONS_PER_PAGE = 5;

const CouponTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "code",
    direction: "asc",
  });
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [isCouponOpen, setCouponIsOpen] = useState(false); // Trạng thái mở/đóng modal
  const [isUpdateCouponOpen, setUpdateCouponIsOpen] = useState(false); // Trạng thái mở/đóng modal
  const [couponSelected, setCouponSelected] = useState(null);

  const handleAddCoupon = async (newCoupon) => {
    try {
      setCoupons((prev) => [...prev, newCoupon]);
      setFilteredCoupons((prev) => [...prev, newCoupon]);
    } catch (error) {
      console.error("Failed to add color:", error);
    }
  };

  const handleUpdateCoupon = (updatedCoupon) => {
    setCoupons((prevCoupons) =>
      prevCoupons.map((coupon) =>
        coupon._id === updatedCoupon._id ? updatedCoupon : coupon
      )
    );
    setFilteredCoupons((prevCoupons) =>
      prevCoupons.map((coupon) =>
        coupon._id === updatedCoupon._id ? updatedCoupon : coupon
      )
    );
  };

  const handleDeleteCoupon = async (couponId) => {
    // Tìm mã khuyến mãi cần xóa trong mảng coupons
    const couponToDelete = coupons.find((item) => item._id === couponId);

    // Kiểm tra xem mã khuyến mãi có tồn tại hay không
    if (!couponToDelete) {
      toast.error(`Coupon với ID ${couponId} không tìm thấy!`);
      return; // Thoát khỏi hàm nếu không tìm thấy coupon
    }

    // Hiển thị hộp thoại xác nhận xóa với thông tin tên mã khuyến mãi
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa mã khuyến mãi "${couponToDelete.code}" không?`
    );

    if (!confirmed) return; // Nếu người dùng không xác nhận, dừng lại

    try {
      // Gọi API để xóa mã khuyến mãi
      await deleteCoupon(couponId);

      // Cập nhật lại trạng thái để loại bỏ mã khuyến mãi đã xóa khỏi giao diện
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      setFilteredCoupons(coupons.filter((coupon) => coupon._id !== couponId));

      toast.success(
        `Mã khuyến mãi "${couponToDelete.code}" đã được xóa thành công!`
      );
    } catch (error) {
      console.log(error.message);
      toast.error("Đã xảy ra lỗi khi xóa mã khuyến mãi!");
    }
  };

  const fetchCoupons = async () => {
    try {
      const couponsData = await getAllCoupons();
      setCoupons(couponsData); // Lưu danh sách mã khuyến mãi vào state
      setFilteredCoupons(couponsData); // Khởi tạo danh sách mã khuyến mãi đã lọc
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mã khuyến mãi:", error);
    }
  };

  const offset = currentPage * COUPONS_PER_PAGE;
  const currentCoupons = filteredCoupons.slice(
    offset,
    offset + COUPONS_PER_PAGE
  ); // Lấy các coupon hiện tại

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = coupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(term) ||
        coupon.discountPercentage.toString().includes(term) || // Chuyển thành chuỗi nếu là số
        coupon.startDate.toLowerCase().includes(term) ||
        coupon.expirationDate.toLowerCase().includes(term) ||
        coupon.minimumPurchaseAmount.toString().includes(term) || // Chuyển thành chuỗi nếu là số
        coupon.isActive.toString().toLowerCase().includes(term) || // Chuyển thành chuỗi nếu là boolean
        coupon.maxUsage.toString().includes(term) ||
        coupon.usageCount.toString().includes(term)
    );

    setFilteredCoupons(filtered);
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredCoupons].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCoupons(sorted);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Danh sách mã khuyến mãi
          </h2>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={(e) => setCouponIsOpen(true)}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm mã khuyến mãi..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[
                { label: "Mã", key: "code" },
                { label: "Phần trăm giảm", key: "discountPercentage" },
                { label: "Ngày bắt đầu", key: "startDate" },
                { label: "Ngày kết thúc", key: "expirationDate" },
                { label: "Giá trị tối thiểu", key: "minimumPurchaseAmount" },
                { label: "Kích hoạt", key: "isActive" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentCoupons.map((coupon) => (
              <motion.tr
                key={coupon.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {coupon?.code}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {coupon?.discountPercentage}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {coupon?.startDate ? coupon.startDate : "Chưa có ngày"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {coupon?.expirationDate
                      ? coupon.expirationDate
                      : "Chưa có ngày"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {coupon?.minimumPurchaseAmount.toLocaleString("vi-VN")} Đ
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coupon?.isActive
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {coupon?.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-blue-400 font-bold hover:text-indigo-300 mr-2 rounded-lg text-xs p-1"
                    onClick={(e) => {
                      setUpdateCouponIsOpen(true), setCouponSelected(coupon);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 font-bold hover:text-indigo-300 mr-2 rounded-lg text-xs p-1"
                    onClick={(e) => handleDeleteCoupon(coupon._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination
          pageCount={Math.ceil(filteredCoupons.length / COUPONS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>
      <AddCoupon
        isCouponOpen={isCouponOpen}
        setCouponIsOpen={setCouponIsOpen}
        onAddCoupon={handleAddCoupon}
      />
      <UpdateCoupon
        isUpdateCouponOpen={isUpdateCouponOpen}
        setUpdateCouponIsOpen={setUpdateCouponIsOpen}
        coupon={couponSelected}
        onUpdateCoupon={handleUpdateCoupon}
      />
    </motion.div>
  );
};

export default CouponTable;
