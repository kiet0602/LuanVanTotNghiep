import { motion } from "framer-motion";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddProduct from "../add/AddProduct";
import {
  deleteProduct,
  getAllProductLowQuantity,
  getProducts,
} from "../../service/productService";
import Pagination from "../pagination/Pagination";
import UpdateProductModal from "../update/UpdateProductModal";

const PRODUCTS_PER_PAGE = 5;

const ProductsTableLowQuantity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng modal
  const [isUpdateOpen, setIsUpdateOpen] = useState(false); // Trạng thái mở/đóng modal

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [selectedProduct, setSelectedProduct] = useState(null);
  // hàm rút ngắn chữ khi quá dài
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  // tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(term) ||
        product.category.categoryName.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  // sắp xếp
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const getNestedValue = (obj, key) => {
      return key.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    const sorted = [...filteredProducts].sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(sorted);
  };

  // Lấy dữ liệu tất cả sản phẩm
  const fetchProducts = async () => {
    try {
      const data = await getAllProductLowQuantity();
      setProducts(data);
      setFilteredProducts(data); // Cập nhật filteredCategories sau khi fetch
    } catch (error) {
      console.error("Failed to fetch classifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // phân trang
  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  // cập nhật lại danh sách sản phẩm khi đã thực hiện thêm
  const handleAddProduct = async (newProduct) => {
    try {
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setFilteredProducts((prevProducts) => [...prevProducts, newProduct]);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };
  // xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    // Tìm sản phẩm theo ID trước khi xóa
    const productToDelete = products.find((item) => item._id === productId);

    if (!productToDelete) {
      toast.error("Không tìm thấy sản phẩm.");
      return;
    }

    // Xác nhận việc xóa
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm: ${productToDelete.productName}?`
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await deleteProduct(productId);
      setFilteredProducts((prev) =>
        prev.filter((item) => item._id !== productId)
      );
      setProducts((prev) => prev.filter((item) => item._id !== productId));
      toast.success(`Sản phẩm "${productToDelete.productName}" đã được xóa.`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchProducts();
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
            Danh sách sản phẩm tồn kho ít
          </h2>
          {/* <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={18} />
          </button> */}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
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
              {[
                { label: "Tên sản phẩm", key: "productName" },
                { label: "Thể loại", key: "category.categoryName" },
                { label: "Giá gốc", key: "originalPrice" },
                { label: "Giá cuối", key: "finalPrice" },
                { label: "Số lượng", key: "quantity" },
                { label: "Đã bán", key: "orderCount" },
                { label: "Giảm giá", key: "discount" },
              ].map(({ label, key }) => (
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
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentProducts.map((product) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center">
                  <img
                    src={`http://localhost:2000/images/${product.image[0]}`}
                    alt="Product img"
                    className="size-10 rounded-full"
                  />
                  {truncateString(product?.productName, 10)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {product?.category?.categoryName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {product?.originalPrice?.toLocaleString("vi-VN")} Đ
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {product?.finalPrice?.toLocaleString("vi-VN")} Đ
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {product?.quantity}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {product?.orderCount}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product?.discount !== 0
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {product?.discount ? product?.discount : 0}%
                  </span>
                </td>

                {/* Nếu không có discount thì hiển thị 0 */}

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                    <Edit
                      size={18}
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsUpdateOpen(true);
                      }}
                    />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2
                      size={18}
                      onClick={() => handleDeleteProduct(product._id)}
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
          pageCount={Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      </div>
      <AddProduct
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAdd={handleAddProduct}
      />
      <UpdateProductModal
        fetchProducts={fetchProducts}
        isUpdateOpen={isUpdateOpen}
        setIsUpdateOpen={setIsUpdateOpen}
        product={selectedProduct}
      />
    </motion.div>
  );
};
export default ProductsTableLowQuantity;
