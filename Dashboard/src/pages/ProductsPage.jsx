import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import {
  AlertTriangle,
  DollarSign,
  Package,
  Plus,
  TrendingUp,
} from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { useEffect, useState } from "react";
import ProductsTableLowQuantity from "../components/products/ProductsTableLowQuantity";
import {
  getAllProductLowQuantity,
  getProducts,
} from "../service/productService";
import DailyOrders from "../components/orders/DailyOrders";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [productsLowQuantity, setProductsLowQuantity] = useState([]);

  const getProductLowQuantity = async () => {
    try {
      const data = await getAllProductLowQuantity();
      setProductsLowQuantity(data);
    } catch (error) {
      console.error("Failed to fetch classifications:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch classifications:", error);
    }
  };

  useEffect(() => {
    getProductLowQuantity();
    getAllProducts();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sản phẩm" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tất cả sản phẩm"
            icon={Package}
            value={products.length}
            color="#6366F1"
          />
          {/* <StatCard
            name="Top Selling"
            icon={TrendingUp}
            value={89}
            color="#10B981"
          /> */}
          <StatCard
            name="Sản phẩm số lượng < 5"
            icon={AlertTriangle}
            value={productsLowQuantity.length}
            color="#F59E0B"
          />
          {/* <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={"$543,210"}
            color="#EF4444"
          /> */}
        </motion.div>
        {/* Button to open modal */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8 mb-10">
          {/* <SalesTrendChart /> */}
          <DailyOrders />
          <CategoryDistributionChart />
        </div>

        <ProductsTable />
        <ProductsTableLowQuantity />

        {/* CHARTS */}
      </main>
    </div>
  );
};
export default ProductsPage;
