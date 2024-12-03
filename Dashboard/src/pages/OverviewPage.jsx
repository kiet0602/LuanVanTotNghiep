import { BarChart2, Package, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { getAllOrders, getRevenue } from "../service/orderService.js";
import { useEffect, useState } from "react";
import { getAllUsers } from "../service/userService.js";
import { getProducts } from "../service/productService.js";
import OverviewTableProductSaleHigh from "../components/overview/OverviewTableProductSaleHigh.jsx";

const OverviewPage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lengthUsers, setLengthUsers] = useState(0);
  const [lengthProducts, setLengthProducts] = useState(0);
  const [orders, setOrders] = useState(0);

  const fetchOrders = async () => {
    try {
      const Orders = await getAllOrders();
      setOrders(Orders.length);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const { totalRevenue } = await getRevenue();
      setTotalRevenue(totalRevenue);
    } catch (error) {
      console.error("Failed to fetch orders and revenue", error);
    }
  };
  const fetchDataUsers = async () => {
    try {
      const userData = await getAllUsers(); // Gọi API để lấy danh sách người dùng
      setLengthUsers(userData.length);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu người dùng", error);
    }
  };
  const fetchDataProducts = async () => {
    try {
      const productsData = await getProducts(); // Gọi API để lấy danh sách người dùng
      setLengthProducts(productsData.length);
    } catch (error) {
      console.error("Lỗi lấy products", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchDataUsers();
    fetchDataProducts();
    fetchOrders();
  }, [totalRevenue, lengthUsers, lengthProducts]);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-white">
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
            value={`${totalRevenue.toLocaleString()} Đ`}
            color="#6366F1"
          />
          <StatCard
            name="Người dùng"
            icon={Users}
            value={lengthUsers}
            color="#8B5CF6"
          />
          <StatCard
            name="Sản phẩm tổng cộng"
            icon={Package}
            value={lengthProducts}
            color="#EC4899"
          />
          <StatCard
            name="Tổng đơn hàng"
            icon={ShoppingBag}
            value={orders}
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}
        <OverviewTableProductSaleHigh />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
