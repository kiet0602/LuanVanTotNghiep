import express from "express";
import {
  addToCart,
  updateCart,
  removeFromCart,
} from "../controller/cartController.js";

const cartRouter = express.Router();

// Thêm sản phẩm vào giỏ hàng
cartRouter.post("/add", addToCart);

// Cập nhật sản phẩm trong giỏ hàng
cartRouter.put("/update", updateCart);

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete("/remove", removeFromCart);

export default cartRouter;
