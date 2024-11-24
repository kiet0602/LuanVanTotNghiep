// models/Import.js
import mongoose from "mongoose";

const importSchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: true, // Nhà cung cấp là bắt buộc
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, // Mỗi sản phẩm trong phiếu nhập là bắt buộc
      },
      quantity: {
        type: Number,
        required: true, // Số lượng nhập của sản phẩm là bắt buộc
      },
      cost: {
        type: Number,
        required: true, // Giá nhập cho mỗi sản phẩm
      },
    },
  ],
  totalCost: {
    type: Number,
    required: true, // Tổng chi phí cho phiếu nhập
  },
  createdAt: {
    type: Date,
    default: Date.now, // Ngày tạo phiếu nhập
  },
});

// Middleware tính toán totalCost trước khi lưu

const ImportModel = mongoose.model("Import", importSchema);

export default ImportModel;
