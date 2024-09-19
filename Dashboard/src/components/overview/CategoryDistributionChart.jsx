import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getQuantitySalesByCategory } from "../../service/orderService";

// Doanh số sản phẩm theo từng loại
const categoryData = [
  { categoryName: "Electronics", totalQuantity: 4500 },
  { categoryName: "Clothing", totalQuantity: 3200 },
  { categoryName: "Home & Garden", totalQuantity: 2800 },
  { categoryName: "Books", totalQuantity: 2100 },
  { categoryName: "Sports & Outdoors", totalQuantity: 1900 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const [quantitySalesByCategory, setQuantitySalesByCategory] = useState([]);

  useEffect(() => {
    const fetchQuantitySalesByCategory = async () => {
      try {
        const data = await getQuantitySalesByCategory();
        setQuantitySalesByCategory(data); // Cập nhật dữ liệu doanh thu
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      }
    };

    fetchQuantitySalesByCategory();
  }, []);

  // Custom Legend component
  const renderLegend = () => (
    <div className="flex flex-col">
      {quantitySalesByCategory.map((entry, index) => (
        <div key={index} className="flex items-center mb-1">
          <div
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
            className="w-4 h-4 mr-2 rounded-full"
          />
          <span className="text-gray-100">{entry.categoryName}</span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Số lượng bán sản phẩm theo từng thể loại
      </h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={quantitySalesByCategory}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="totalQuantity"
              label={({ categoryName, percent }) =>
                `${categoryName} ${(percent * 100).toFixed(0)}%`
              }
            >
              {quantitySalesByCategory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
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
            {/* Render custom legend */}
            {renderLegend()}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
