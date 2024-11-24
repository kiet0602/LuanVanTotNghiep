import { motion } from "framer-motion";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../pagination/Pagination.jsx";
import AddColor from "../add/AddColor.jsx";
import { deleteColorById, getAllColors } from "../../service/colorService.js";
import UpdateColorModal from "../update/UpdateColorModal.jsx";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 10;

const ColorTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng modal
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = colors.filter((color) =>
      color.nameColor.toLowerCase().includes(term)
    );
    setFilteredColors(filtered);
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredColors].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredColors(sorted);
  };

  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentColors = filteredColors.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  //Cập nhật danh sách khi thêm
  const handleAddColor = async (newColor) => {
    try {
      setColors((prev) => [...prev, newColor]);
      setFilteredColors((prev) => [...prev, newColor]);
    } catch (error) {
      console.error("Failed to add color:", error);
    }
  };
  // Cập nhật danh sách khi xóa

  const handleDeleteColor = async (classificationId) => {
    try {
      // Tìm tên màu trước khi xóa
      const colorToDelete = colors.find(
        (item) => item._id === classificationId
      );

      if (!colorToDelete) {
        toast.error("Không tìm thấy màu để xóa!");
        return;
      }

      await deleteColorById(classificationId);

      // Cập nhật danh sách gốc và danh sách đã lọc
      setColors((prev) => prev.filter((item) => item._id !== classificationId));
      setFilteredColors((prev) =>
        prev.filter((item) => item._id !== classificationId)
      );

      // Thông báo tên màu đã xóa
      toast.success(`Xóa thành công '${colorToDelete.nameColor}'!`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa màu sắc thất bại!");
    }
  };

  const fetchDataColor = async () => {
    try {
      const data = await getAllColors();
      setColors(data);
      setFilteredColors(data);
    } catch (err) {
      console.error(err); // In lỗi nếu có
    }
  };

  useEffect(() => {
    fetchDataColor();
  }, [colors.length]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Danh sách màu sắc đặc trưng
          </h2>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={18} /> {/* Icon cộng */}
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[{ key: "nameColor", label: "Tên màu" }].map(
                ({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  >
                    {label}
                    {sortConfig.key === key && (
                      <span
                        className={`ml-2 ${
                          sortConfig.direction === "asc"
                            ? "text-blue-400"
                            : "text-red-400"
                        }`}
                      >
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                )
              )}
              <th
                className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right"
                style={{ textAlign: "right" }}
              >
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentColors.map((color) => (
              <motion.tr
                key={color._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-left">
                  {color.nameColor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right flex justify-end">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => {
                      setSelectedColor(color);
                      setIsOpenUpdate(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteColor(color._id)}
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
          pageCount={Math.ceil(filteredColors.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>
      <AddColor isOpen={isOpen} setIsOpen={setIsOpen} onAdd={handleAddColor} />

      <UpdateColorModal
        fetchDataColor={fetchDataColor}
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        color={selectedColor}
      />
    </motion.div>
  );
};
export default ColorTable;
