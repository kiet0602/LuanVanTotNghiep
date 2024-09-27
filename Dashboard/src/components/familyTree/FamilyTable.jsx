import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import Pagination from "../pagination/Pagination.jsx";
import AddFamilyModal from "../add/AddFamilyModal.jsx";

import {
  getClassifications,
  deleteClassification,
} from "../../service/classificationService.js";
import UpdateClassificationModal from "../update/UpdateClassificationModal.jsx";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 5;

const FamilyTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [filteredClassifications, setFilteredClassifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedClassification, setSelectedClassification] = useState(null);

  // tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = classifications.filter((classification) =>
      classification.classificationName.toLowerCase().includes(term)
    );
    setFilteredClassifications(filtered);
    setCurrentPage(0);
  };
  // sắp xếp
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredClassifications].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredClassifications(sorted);
  };
  //phân trang
  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentProducts = filteredClassifications.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  // xóa
  const handleDeleteClassification = async (classificationId) => {
    try {
      // Tìm phân loại cần xóa
      const classificationToDelete = classifications.find(
        (item) => item._id === classificationId
      );
      // Xóa phân loại
      await deleteClassification(classificationId);
      // Cập nhật trạng thái
      setClassifications((prev) =>
        prev.filter((item) => item._id !== classificationId)
      );
      setFilteredClassifications((prev) =>
        prev.filter((item) => item._id !== classificationId)
      );

      // Hiển thị thông báo thành công
      if (classificationToDelete) {
        toast.success(
          `Đã xóa thành công: ${classificationToDelete.classificationName}`
        );
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa không thành công. Vui lòng thử lại.");
    }
  };

  //Thêm
  const handleAddClassification = async (newClassification) => {
    try {
      setClassifications((prev) => [...prev, newClassification]);
      setFilteredClassifications((prev) => [...prev, newClassification]);
    } catch (error) {
      console.error("Failed to add classification:", error);
    }
  };
  // lấy tất cả họ cây
  const fetchClassifications = async () => {
    try {
      setLoading(true);
      const data = await getClassifications();
      setClassifications(data);
      setFilteredClassifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifications();
  }, [classifications.length]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Danh sách họ cây
          </h2>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={18} />
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
              {["classificationName"].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  style={{ textAlign: "left" }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
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
              ))}
              <th
                className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right"
                style={{ textAlign: "right" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentProducts.map((classification) => (
              <motion.tr
                key={classification._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-left">
                  {classification.classificationName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => {
                      setSelectedClassification(classification);
                      setIsOpenUpdate(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() =>
                      handleDeleteClassification(classification._id)
                    }
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
          pageCount={Math.ceil(
            filteredClassifications.length / PRODUCTS_PER_PAGE
          )}
          onPageChange={handlePageChange}
        />
      </div>
      <AddFamilyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAdd={handleAddClassification}
      />
      <UpdateClassificationModal
        fetchClassifications={fetchClassifications}
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        classification={selectedClassification}
      />
    </motion.div>
  );
};

export default FamilyTable;
