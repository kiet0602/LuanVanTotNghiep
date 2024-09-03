import express from "express";
import { placeOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/order", placeOrder);

export default orderRouter;
