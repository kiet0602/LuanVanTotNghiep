import { motion } from "framer-motion";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddEvioment from "../add/AddEvioment";
import Pagination from "../pagination/Pagination.jsx";
import {
  deleteEnvironmentById,
  getAllEnvironments,
} from "../../service/eviomentService";
import UpdateEvironmentModal from "../update/UpdateEvironmentModal.jsx";

const PRODUCTS_PER_PAGE = 10;

const EviomentsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [environments, setEnvironments] = useState([]);
  const [filteredEnvironments, setFilteredEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);

  const fetchDataEnvironment = async () => {
    try {
      const data = await getAllEnvironments();
      setEnvironments(data);
      setFilteredEnvironments(data);
    } catch (err) {
      console.error(err); // In lỗi nếu có
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = environments.filter((environment) =>
      environment.nameEnviroment.toLowerCase().includes(term)
    );
    setFilteredEnvironments(filtered);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredEnvironments].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredEnvironments(sorted);
  };

  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentEnvironment = filteredEnvironments.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAddEnviroment = async (newEnvironment) => {
    try {
      setEnvironments((prev) => [...prev, newEnvironment]);
      setFilteredEnvironments((prev) => [...prev, newEnvironment]);
    } catch (error) {
      console.error("Failed to add color:", error);
    }
  };

  const handleDeleteEnvironment = async (environmentId) => {
    try {
      await deleteEnvironmentById(environmentId);
      setFilteredEnvironments((prev) =>
        prev.filter((item) => item._id !== environmentId)
      );
      setEnvironments((prev) =>
        prev.filter((item) => item._id !== environmentId)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    fetchDataEnvironment();
  }, []);

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="">
          <h2 className="text-xl font-semibold text-black mb-4">
            Danh sách môi trường ưa thích
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
            placeholder="Tìm kiếm điều kiện ưu thích..."
            className="bg-gray-300 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[{ key: "nameEnviroment", label: "Môi trường sống" }].map(
                ({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
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
                className="px-6 py-3 text-xs font-medium text-black uppercase tracking-wider text-right"
                style={{ textAlign: "right" }}
              >
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentEnvironment.map((environment) => (
              <motion.tr
                key={environment._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black text-left">
                  {environment.nameEnviroment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right flex justify-end">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => {
                      setSelectedEnvironment(environment);
                      setIsOpenUpdate(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteEnvironment(environment._id)}
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
          pageCount={Math.ceil(filteredEnvironments.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>
      <AddEvioment
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAdd={handleAddEnviroment}
      />
      <UpdateEvironmentModal
        fetchDataEnvironment={fetchDataEnvironment}
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        environment={selectedEnvironment}
      />
    </motion.div>
  );
};
export default EviomentsTable;
