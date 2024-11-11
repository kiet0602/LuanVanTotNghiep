import { motion } from "framer-motion";

import Header from "../components/common/Header";
import { useEffect, useState } from "react";
import { getProducts } from "../service/productService";
import ImportForm from "../components/import/import";
import axios from "axios";
import ImportTable from "../components/import/ImportTable";

const ImportPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
        console.log(products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleImportSubmit = async (importData) => {
    console.log("Dữ liệu phiếu nhập:", importData);
    try {
      const reponse = await axios.post(
        `http://localhost:2000/api/import/createImport`,
        importData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Phiếu nhập" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* <StatCard
            name="Tổng số thể loại"
            icon={Package}
            value={1234}
            color="#6366F1"
          />
          <StatCard
            name="Top Selling"
            icon={TrendingUp}
            value={89}
            color="#10B981"
          />
          <StatCard
            name="Low Stock"
            icon={AlertTriangle}
            value={23}
            color="#F59E0B"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={"$543,210"}
            color="#EF4444"
          /> */}
        </motion.div>
        {/* Button to open modal */}
        <div>
          <h1 className="text-2xl font-bold text-center mt-6">
            Quản Lý Nhập Kho
          </h1>
          <ImportForm products={products} onSubmit={handleImportSubmit} />
        </div>

        <ImportTable />
        {/* CHARTS */}
      </main>
    </div>
  );
};
export default ImportPage;
