import { motion } from "framer-motion";
import { Axe, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../pagination/Pagination.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Import from "../watch/checkImport.jsx";

const PRODUCTS_PER_PAGE = 10;

const ImportTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "supplier", // Có thể là tên nhà cung cấp hoặc trường khác
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [imports, setImports] = useState([]);
  const [filteredImports, setFilteredImports] = useState([]);

  const [selectedImport, setSelectedImport] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = imports.filter(
      (importItem) => importItem.supplier.toLowerCase().includes(term) // Tìm kiếm theo nhà cung cấp
    );
    setFilteredImports(filtered);
    setCurrentPage(0); // Reset trang khi tìm kiếm
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredImports].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredImports(sorted);
  };

  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentImports = filteredImports.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchDataImport = async () => {
    try {
      const data = await axios.get(
        `http://localhost:2000/api/import/getAllImport`
      );
      setImports(data.data);
      setFilteredImports(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataImport();
  }, [imports.length]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            Danh sách phiếu nhập
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm nhà cung cấp..."
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
              {[
                { key: "supplier", label: "Nhà cung cấp" },
                { key: "createdAt", label: "Ngày lập phiếu nhập" },
              ].map(({ key, label }) => (
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
              ))}
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentImports.map((importItem) => (
              <motion.tr
                key={importItem._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-left">
                  {importItem.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-left">
                  {formatDate(importItem.createdAt)} {/* Hiển thị ngày nhập */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right flex justify-end">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => {
                      setSelectedImport(importItem);
                      setIsOpen(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteImport(importItem._id)}
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
          pageCount={Math.ceil(filteredImports.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>

      <Import
        oneImport={selectedImport}
        setIsOpenSeeImport={setIsOpen}
        isOpen={isOpen}
      />
    </motion.div>
  );
};

export default ImportTable;
