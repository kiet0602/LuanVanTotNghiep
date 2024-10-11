import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getQuantitySalesByCategory } from "../../service/orderService";

const COLORSEE = [
  "#EC4899", // Màu hồng
  "#8B5CF6", // Màu tím
  "#10B981", // Màu xanh lá
  "#F59E0B", // Màu vàng
  "#6366F1", // Màu xanh da trời
  "#FF6B6B", // Màu đỏ
  "#4ECDC4", // Màu xanh nước biển
  "#45B7D1", // Màu xanh ngọc
  "#FED766", // Màu vàng nhạt
  "#FF9A00", // Màu cam
  "#FFB6C1", // Màu hồng nhạt
  "#B0E0E6", // Màu xanh nhẹ
  "#DDA0DD", // Màu tím nhạt
  "#FF4500", // Màu cam đậm
  "#00BFFF", // Màu xanh dương sáng
  "#7B68EE", // Màu tím đậm
  "#FF1493", // Màu hồng đậm
  "#FFD700", // Màu vàng ánh kim
  "#ADFF2F", // Màu xanh lá sáng
  "#1E90FF", // Màu xanh da trời đậm
  "#FF6347", // Màu cà chua
];

const CategoryDistributionChart = () => {
  const [quantitySalesByCategory, setQuantitySalesByCategory] = useState([]);

  // Fetch data from API
  const fetchQuantitySalesByCategory = async () => {
    try {
      const response = await getQuantitySalesByCategory();
      setQuantitySalesByCategory(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  // Chuyển đổi categoryName thành name
  const transformedData = quantitySalesByCategory.map((item) => ({
    name: item.categoryName, // Đổi categoryName thành name
    value: item.totalQuantity, // Gán totalQuantity cho value
  }));

  useEffect(() => {
    fetchQuantitySalesByCategory();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Tỷ lệ bán sản phẩm theo từng thể loại
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={transformedData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value" // Dùng value cho dữ liệu số lượng
              label={({ name, percent }) =>
                `${truncateString(name, 10)} ${(percent * 100).toFixed(0)}%`
              } // Hiển thị name thay vì categoryName
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORSEE[index % COLORSEE.length]} // Sử dụng màu sắc từ mảng COLORS
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
