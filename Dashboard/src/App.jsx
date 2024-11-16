import { Route, Routes, Navigate } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import CategoryPage from "./pages/CategoryPage";
import ColorsPage from "./pages/ColorsPage";
import FamilyPage from "./pages/FamilyPage";
import EviomentPage from "./pages/EviomentPage";
import PouponPage from "./pages/PouponPage";
import ImportPage from "./pages/ImportPage";
import LoginForm from "./pages/SignInPage";

function App() {
  const adminToken = localStorage.getItem("adminToken");

  return (
    <Routes>
      {/* Đường dẫn dành cho trang đăng nhập */}
      <Route
        path="/signIn"
        element={
          <div className="h-screen">
            <LoginForm />
          </div>
        }
      />

      {/* Đường dẫn dành cho các trang khác */}
      <Route
        path="*"
        element={
          adminToken ? (
            <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
              {/* BG */}
              <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
              </div>
              <Sidebar />
              <Routes>
                <Route path="/overview" element={<OverviewPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/color" element={<ColorsPage />} />
                <Route path="/family" element={<FamilyPage />} />
                <Route path="/evioment" element={<EviomentPage />} />
                <Route path="/poupons" element={<PouponPage />} />
                <Route path="/GoodsReceipt" element={<ImportPage />} />
                <Route path="/profile" element={<SettingsPage />} />
              </Routes>
            </div>
          ) : (
            // Nếu không có adminToken, điều hướng đến trang đăng nhập
            <Navigate to="/signIn" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
