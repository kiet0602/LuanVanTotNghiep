import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";

import CouponTable from "../components/coupon/CouponTable";

const PouponPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Khuyến mãi" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* <StatCard
            name="Tổng số người dùng"
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="Người dùng mới hôm nay"
            icon={UserPlus}
            value={userStats.newUsersToday}
            color="#10B981"
          />
          <StatCard
            name="Người dùng đang hoạt động"
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Phần trăm người dùng đã rời"
            icon={UserX}
            value={userStats.churnRate}
            color="#EF4444"
          /> */}
        </motion.div>

        <CouponTable />

        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"></div>
      </main>
    </div>
  );
};
export default PouponPage;
