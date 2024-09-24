import { motion } from "framer-motion";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../pagination/Pagination.jsx";
import AddCategory from "../add/AddCategory.jsx";
import {
  deleteCategory,
  getAllCategories,
} from "../../service/categoryService.js";
import UpdateCategoryModal from "../update/UpdateCategoryModal.jsx";

const PRODUCTS_PER_PAGE = 5;

const CategorysTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng modal
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        setFilteredCategories(data); // Cập nhật filteredCategories sau khi fetch
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = categories.filter((category) =>
      category.categoryName.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCategories].sort((a, b) => {
      const aValue =
        key === "classification"
          ? a.classification?.classificationName
          : a[key];
      const bValue =
        key === "classification"
          ? b.classification?.classificationName
          : b[key];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCategories(sorted);
  };

  // Xác định các sản phẩm hiển thị trên trang hiện tại
  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentCategories = filteredCategories.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAddCategory = async (newCategory) => {
    try {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setFilteredCategories((prevCategories) => [
        ...prevCategories,
        newCategory,
      ]);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setFilteredCategories((prev) =>
        prev.filter((item) => item._id !== categoryId)
      );
      setCategories((prev) => prev.filter((item) => item._id !== categoryId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

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
            Danh sách thể loại
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
              {["categoryName", "classification"].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentCategories.map((category) => (
              <motion.tr
                key={category._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src={`http://localhost:2000/images/${category?.imageCategory}`}
                    alt="Product img"
                    className="size-10 rounded-full"
                  />
                  {category?.categoryName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {category?.classification?.classificationName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsOpenUpdate(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2
                      size={18}
                      onClick={() => handleDeleteCategory(category._id)}
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
          pageCount={Math.ceil(filteredCategories.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>
      <AddCategory
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAdd={handleAddCategory}
      />
      <UpdateCategoryModal
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        category={selectedCategory}
      />
    </motion.div>
  );
};
export default CategorysTable;
