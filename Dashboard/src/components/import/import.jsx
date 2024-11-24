import React, { useState } from "react";
import { toast } from "react-toastify";

const ImportForm = ({ products, onSubmit }) => {
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1, price: "" }]);
  const [showImport, setShowImport] = useState(false);

  const handleSupplierChange = (e) => {
    setSupplier(e.target.value);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { product: "", quantity: 1, price: "" }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validItems = items.filter(
      (item) => item.product && item.quantity > 0 && item.price > 0
    );
    if (supplier && validItems.length > 0) {
      onSubmit({ supplier, items: validItems });
      setSupplier("");
      setItems([{ product: "", quantity: 1, price: "" }]);
      setShowImport(false);
      toast.success("Đã tạo phiếu nhập thành công");
    } else {
      toast.error(
        "Bạn cần nhập đầy đủ thông tin nhà cung cấp, sản phẩm, số lượng và giá nhập!"
      );
    }
  };
  console.log(items);

  return (
    <div className="p-6 bg-dark rounded-lg shadow-md max-w-3lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Thêm Phiếu Nhập</h2>

      {/* Nút để hiển thị form */}
      {!showImport && (
        <button
          onClick={() => setShowImport(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Mở Form Phiếu Nhập
        </button>
      )}

      {/* Hiển thị form khi showImport là true */}
      {showImport && (
        <form onSubmit={handleSubmit}>
          {/* Nhập nhà cung cấp */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="supplier"
            >
              Nhà cung cấp
            </label>
            <input
              type="text"
              id="supplier"
              value={supplier}
              onChange={handleSupplierChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Nhập tên nhà cung cấp"
              required
            />
          </div>

          {/* Sản phẩm */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Sản phẩm
            </label>
            {items.map((item, index) => (
              <div key={index} className="flex items-center mb-2 space-x-2">
                {/* Chọn sản phẩm */}
                <select
                  value={item.product}
                  onChange={(e) =>
                    handleItemChange(index, "product", e.target.value)
                  }
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>

                {/* Số lượng */}
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  min="1"
                  className="w-1/6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Số lượng"
                  required
                />

                {/* Giá nhập */}
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  min="0"
                  className="w-1/6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Giá nhập"
                  required
                />

                {/* Nút xóa sản phẩm */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Nút thêm sản phẩm */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
            >
              + Thêm Sản Phẩm
            </button>
          </div>

          {/* Nút submit */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              + Tạo Phiếu Nhập
            </button>
            <button
              onClick={() => setShowImport(false)}
              className="w-full px-4 py-2 mt-2 bg-red-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Tắt Form Phiếu Nhập
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ImportForm;
