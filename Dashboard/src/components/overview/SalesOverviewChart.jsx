import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getMonthlyRevenue } from "../../service/orderService";

//Doanh số bán hàng theo tháng
// const salesData = [
//   { name: "Jul", sales: 4200 },
//   { name: "Aug", sales: 3800 },
//   { name: "Sep", sales: 5100 },
//   { name: "Oct", sales: 4600 },
//   { name: "Nov", sales: 5400 },
//   { name: "Dec", sales: 7200 },
//   { name: "Jan", sales: 6100 },
//   { name: "Feb", sales: 5900 },
//   { name: "Mar", sales: 6800 },
//   { name: "Apr", sales: 6300 },
//   { name: "May", sales: 7100 },
//   { name: "Jun", sales: 7500 },
// ];

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await getMonthlyRevenue();
        setSalesData(data); // Cập nhật dữ liệu doanh thu
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const strokeColor = "9CA3AF";
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Doanh số bán hàng theo tháng
      </h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            {/* XAxis : tự xét giá trị theo doanh số của cửa hàng */}
            <XAxis dataKey={"name"} stroke="#9ca3af" />

            <YAxis
              stroke="#FFFFFF" // Đặt màu chữ thành trắng
              tickFormatter={(value) => {
                // Định dạng giá trị với "M" và giới hạn tối đa 3 triệu VNĐ
                const maxLimit = 3000000; // 3 triệu VNĐ
                if (value >= maxLimit) {
                  return `3M`; // Hiển thị 3 triệu VNĐ nếu giá trị lớn hơn hoặc bằng 3 triệu
                }
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`; // Chia cho 1 triệu và thêm ký tự "M"
                }
                return value; // Nếu giá trị nhỏ hơn 1 triệu, hiển thị số đầy đủ
              }}
              domain={[0, 3000000]} // Đặt giới hạn trục Y từ 0 đến 3 triệu VNĐ
              ticks={[0, 600000, 1200000, 1800000, 2400000, 3000000]} // Đặt 5 mức tiền cụ thể
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default SalesOverviewChart;
