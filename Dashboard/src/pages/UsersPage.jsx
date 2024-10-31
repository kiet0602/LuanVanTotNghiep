import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllUsersWithOrderStatus,
} from "../service/userService";

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
};

const UsersPage = () => {
  const [usersOrdered, setUserOrdered] = useState(null);
  const [usersNoOrdered, setUserNoOrdered] = useState(null);
  const [users, setUsers] = useState(null);

  const getNoOrderedAndOrderedUsers = async () => {
    try {
      const data = await getAllUsersWithOrderStatus();
      setUserOrdered(data.usersWithOrders.length);
      setUserNoOrdered(data.usersWithoutOrders.length);
    } catch (error) {
      console.log("lỗi");
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData.length);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    getNoOrderedAndOrderedUsers();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Người dùng" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng số người dùng"
            icon={UsersIcon}
            value={users}
            color="#6366F1"
          />
          <StatCard
            name="Người dùng đã đặt hàng"
            icon={UserPlus}
            value={usersOrdered}
            color="#10B981"
          />
          <StatCard
            name="Người dùng chưa đặt hàng"
            icon={UserCheck}
            value={usersNoOrdered}
            color="#F59E0B"
          />
          {/* <StatCard
            name="Phần trăm người dùng đã rời"
            icon={UserX}
            value={userStats.churnRate}
            color="#EF4444"
          /> */}
        </motion.div>

        <UsersTable />

        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* <UserGrowthChart />
          <UserActivityHeatmap />
          <UserDemographicsChart /> */}
        </div>
      </main>
    </div>
  );
};
export default UsersPage;
