import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProductsSaleHigh } from "../../service/productService";

const OverviewTableProductSaleHigh = () => {
  const [productsSalesHigh, setProductSaleHigh] = useState([]);

  const fetchProductsSaleHigh = async () => {
    try {
      const response = await getProductsSaleHigh();
      setProductSaleHigh(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductsSaleHigh();
  }, []);

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          Danh sách top 5 sản phẩm bán chạy
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black">
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
                  className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {productsSalesHigh.slice(0, 5).map((product) => (
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
                    className="w-10 h-10 rounded-full"
                  />
                  {product?.productName}
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

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OverviewTableProductSaleHigh;
