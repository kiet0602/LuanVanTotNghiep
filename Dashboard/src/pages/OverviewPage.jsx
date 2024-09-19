import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { getRevenue } from "../service/orderService.js";
import { useEffect, useState } from "react";

const OverviewPage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchRevenue = async () => {
    try {
      const { totalRevenue } = await getRevenue();
      setTotalRevenue(totalRevenue);
      console.log(totalRevenue);
    } catch (error) {
      console.error("Failed to fetch orders and revenue", error);
    }
  };
  const fetchDataUsers = async () => {
    try {
      const { totalRevenue } = await getRevenue();
      setTotalRevenue(totalRevenue);
      console.log(totalRevenue);
    } catch (error) {
      console.error("Failed to fetch orders and revenue", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Tổng quan" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Doanh thu tổng cộng"
            icon={Zap}
            value={`${totalRevenue.toLocaleString()} Đ`} // Định dạng giá trị với dấu phân cách hàng nghìn và ký tự "Đ"
            color="#6366F1" // Màu sắc cho StatCard
          />
          <StatCard
            name="Người dùng mới"
            icon={Users}
            value="1,234"
            color="#8B5CF6"
          />
          <StatCard
            name="Sản phẩm tổng cộng"
            icon={ShoppingBag}
            value="567"
            color="#EC4899"
          />
          {/* <StatCard
            name="Tỷ lệ chuyển đổi"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          /> */}
        </motion.div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
