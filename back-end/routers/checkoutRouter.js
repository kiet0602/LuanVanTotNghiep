import express from "express";

import {
  checkout,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controller/orderController.js";

const checkoutRouter = express.Router();

// Route cho Color
//cartRouter.get("/getAllcolor", getAllColors);
checkoutRouter.post("/checkOut", checkout);
checkoutRouter.get("/getAllcheckOutbyIdUser/:userId", getOrders);
checkoutRouter.get("/checkOutByIdOrder/:orderId", getOrderById);
checkoutRouter.put("/updateCheckOut/:orderId", updateOrder);
checkoutRouter.delete("/deleteCheckOut/:orderId", deleteOrder);
checkoutRouter.get("/getAllOrders", getAllOrders);

export default checkoutRouter;
