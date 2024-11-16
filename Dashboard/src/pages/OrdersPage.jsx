import {
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  Trash,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { useEffect, useState } from "react";
import {
  getAllOrders,
  getAllOrdersByCancel,
  getAllOrdersByCompleted,
  getAllOrdersByPending,
  getRevenue,
} from "../service/orderService";

const OrdersPage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState(0);
  const [ordersPending, setOrdersPending] = useState(0);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [ordersCancels, setOrdersCancels] = useState(0);

  const fetchRevenue = async () => {
    try {
      const { totalRevenue } = await getRevenue();
      setTotalRevenue(totalRevenue);
    } catch (error) {
      console.error("Failed to fetch orders and revenue", error);
    }
  };
  const fetchOrders = async () => {
    try {
      const Orders = await getAllOrders();
      setOrders(Orders.length);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };
  const fetchOrdersPending = async () => {
    try {
      const OrdersPending = await getAllOrdersByPending();
      setOrdersPending(OrdersPending?.length || 0);
    } catch (error) {
      setOrdersPending(0);
      console.error("Failed to fetch orders pending", error);
    }
  };
  const fetchOrdersCancel = async () => {
    try {
      const OrdersCancels = await getAllOrdersByCancel();
      setOrdersCancels(OrdersCancels?.length || 0);
    } catch (error) {
      setOrdersCancels(0);
      console.error("Failed to fetch orders pending", error);
    }
  };
  const fetchOrdersCompleted = async () => {
    try {
      const OrdersCompleted = await getAllOrdersByCompleted();

      // Nếu OrdersCompleted không tồn tại hoặc là mảng rỗng, mặc định là 0
      setOrdersCompleted(OrdersCompleted?.length || 0);
    } catch (error) {
      console.error("Failed to fetch orders completed", error);

      // Trong trường hợp lỗi, cũng đặt giá trị mặc định là 0
      setOrdersCompleted(0);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchOrders();
    fetchOrdersPending();
    fetchOrdersCompleted();
    fetchOrdersCancel();
  }, [totalRevenue, orders, ordersPending, ordersCompleted, ordersCancels]);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Đơn hàng"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng đơn hàng"
            icon={ShoppingBag}
            value={orders}
            color="#6366F1"
          />
          <StatCard
            name="Đơn hàng chưa hoàn thành"
            icon={Clock}
            value={ordersPending}
            color="#F59E0B"
          />
          <StatCard
            name="Đơn hàng hoàn thành"
            icon={CheckCircle}
            value={ordersCompleted}
            color="#10B981"
          />
          <StatCard
            name="Đơn hàng đã hủy"
            icon={Trash}
            value={ordersCancels}
            color="#EF4444"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};
export default OrdersPage;
