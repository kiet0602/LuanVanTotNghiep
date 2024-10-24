import express from "express";
import { createOrder, capturePayment } from "../service/paypal.js"; // Import hàm từ service

const routerPaypal = express.Router();

// Route tạo đơn hàng và trả về link approve của PayPal
routerPaypal.post("/create-order", async (req, res) => {
  const orderData = req.body;

  // Kiểm tra dữ liệu nhận được
  console.log("Dữ liệu nhận được từ frontend:", orderData);

  if (!orderData || !orderData.items) {
    console.error("Thiếu thông tin đơn hàng hoặc items");
    return res
      .status(400)
      .json({ message: "Thiếu thông tin đơn hàng hoặc items" });
  }

  try {
    const approvalUrl = await createOrder(orderData);
    res.status(200).json({ approvalUrl });
  } catch (error) {
    console.error("Error creating order:", error); // In chi tiết lỗi
    res.status(500).json({ message: "Error creating order" });
  }
});

// Route bắt thanh toán sau khi orderId đã được approve
routerPaypal.post("/capture-order", async (req, res) => {
  const { orderId } = req.body;

  try {
    const captureData = await capturePayment(orderId);
    res.status(200).json(captureData);
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ message: "Error capturing payment" });
  }
});

export default routerPaypal;