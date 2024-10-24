import express from "express";

import {
  cancelOrder,
  checkout,
  deleteOrder,
  getAllOrders,
  getCompleted,
  getMonthlyRevenue,
  getOrderById,
  getOrderCountByDate,
  getOrderCountByStatus,
  getOrders,
  getPending,
  getRevenue,
  getSoldProductCountByCategory,
  receiveOrder,
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
checkoutRouter.get("/getCompleted", getCompleted);
checkoutRouter.get("/getPending", getPending);
checkoutRouter.get("/getOrderCountByStatus", getOrderCountByStatus);
checkoutRouter.get("/getOrderCountByDate", getOrderCountByDate);
checkoutRouter.put("/:orderId/cancel", cancelOrder);
checkoutRouter.put("/:orderId/receive", receiveOrder);
// checkoutRouter.post("/paypalCheckout", paypalCheckout);

export default checkoutRouter;
