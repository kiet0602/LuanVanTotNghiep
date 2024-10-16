import express from "express";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
} from "../controller/addressController.js";

const addressRouter = express.Router();

// Tạo địa chỉ mới
addressRouter.post("/addresses", createAddress);

// Lấy danh sách địa chỉ theo userId
addressRouter.get("/addresses/:userId", getAddresses);

// Cập nhật địa chỉ theo addressId
addressRouter.put("/addresses/:addressId", updateAddress);

// Xóa địa chỉ theo addressId
addressRouter.delete("/addresses/:addressId", deleteAddress);

// Lấy địa chỉ mặc định
addressRouter.get("/addresses/default/:userId", getDefaultAddress);

export default addressRouter;
