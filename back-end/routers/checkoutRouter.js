import express from "express";

import {
  checkout,
  deleteOrder,
  getAllOrders,
  getMonthlyRevenue,
  getOrderById,
  getOrders,
  getRevenue,
  getSoldProductCountByCategory,
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

checkoutRouter.get("/getRevenue", getRevenue);
checkoutRouter.get("/getMonthlyRevenue", getMonthlyRevenue);
checkoutRouter.get(
  "/getQuantitySalesByCategory",
  getSoldProductCountByCategory
);

export default checkoutRouter;
