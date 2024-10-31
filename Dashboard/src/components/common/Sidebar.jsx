import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Sun,
  Moon,
  ChartLine,
  LeafyGreen,
  NotebookTabs,
  Rainbow,
  CloudSunRain,
} from "lucide-react";
import { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import imgSenda from "../../assets/data/image/Senda/image.png";
import { ThemeContext } from "../../Theme/ThemeContext.jsx"; // Import ThemeContext

const SIDEBAR_ITEMS = [
  { name: "Tổng quan", icon: ChartLine, color: "#4F46E5", href: "/" },
  // { name: "Đã bán", icon: DollarSign, color: "#10B981", href: "/sales" },
  { name: "Đơn hàng", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  // { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
  { name: "Họ cây", icon: NotebookTabs, color: "#22C55E", href: "/family" },
  { name: "Thể loại", icon: LeafyGreen, color: "#D97706", href: "/category" },
  { name: "Màu sắc", icon: Rainbow, color: "#F43F5E", href: "/color" },
  {
    name: "Môi trường",
    icon: CloudSunRain,
    color: "#F43F5F",
    href: "/evioment",
  },
  { name: "Sản phẩm", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
  { name: "Khuyến mãi", icon: ShoppingBag, color: "#8B5CF6", href: "/poupons" },

  { name: "Người dùng", icon: Users, color: "#EC4899", href: "/users" },
  // { name: "Cài đặt", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use ThemeContext

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <div className="flex items-center gap-2 cursor-pointer">
          <img className="h-8 w-8 rounded-full" src={imgSenda} alt="" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-l from-sky-500 to-blue-600 font-bold italic text-[20px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                Plant Paradise
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit mt-4"
        >
          <Menu size={24} />
        </motion.button>
        {/* Thanh cuộn sidebar */}
        {/* Bổ sung overflow để các mục điều hướng không bị mất */}
        <nav
          className={`mt-8 flex-grow ${
            isSidebarOpen
              ? "overflow-y-auto"
              : "overflow-hidden overflow-y-auto"
          }`}
          style={{
            scrollbarWidth: isSidebarOpen ? "thin" : "none", // Firefox: thin khi mở, ẩn khi đóng
            scrollbarColor: isSidebarOpen ? "#4B5563 transparent" : "none", // Màu thanh cuộn khi mở, ẩn khi đóng
          }}
        >
          <style>
            {`
      nav::-webkit-scrollbar {
        width: ${
          isSidebarOpen ? "6px" : "0px"
        }; /* Hiện thanh cuộn khi mở, ẩn khi đóng */
      }

      nav::-webkit-scrollbar-thumb {
        background-color: #4B5563;
        border-radius: 10px;
      }

      nav::-webkit-scrollbar-track {
        background-color: transparent;
      }
    `}
          </style>
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors mt-4"
        >
          {isDarkMode ? (
            <Sun size={24} color="#FBBF24" />
          ) : (
            <Moon size={24} color="#3B82F6" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
