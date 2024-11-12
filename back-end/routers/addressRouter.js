import express from "express";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
} from "../controller/addressController.js";
import { Auth } from "../middleware/auth.js";

const addressRouter = express.Router();

// Tạo địa chỉ mới
addressRouter.post("/addresses", Auth, createAddress);
// Lấy danh sách địa chỉ theo userId
addressRouter.get("/addresses", Auth, getAddresses);
// Cập nhật địa chỉ theo addressId
addressRouter.put("/addresses/:addressId", Auth, updateAddress);
// Xóa địa chỉ theo addressId
addressRouter.delete("/addresses/:addressId", Auth, deleteAddress);
// Lấy địa chỉ mặc định
addressRouter.get("/addresses/default", Auth, getDefaultAddress);

export default addressRouter;
