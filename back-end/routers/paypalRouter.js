import express from "express";
import {
  createOrder,
  capturePayment,
  saveOrderAfterPayment,
} from "../service/paypal.js"; // Import hàm từ service

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
  const { orderId, orderData } = req.body; // Thêm orderData vào yêu cầu

  try {
    // Gọi hàm capturePayment để xác nhận thanh toán từ PayPal
    const captureData = await capturePayment(orderId);

    // Kiểm tra xem thanh toán đã thành công hay chưa
    if (captureData.status === "COMPLETED") {
      // Gọi hàm để lưu đơn hàng vào cơ sở dữ liệu
      await saveOrderAfterPayment(orderId, orderData);

      // Phản hồi thành công
      res
        .status(200)
        .json({ message: "Payment captured and order saved", captureData });
    } else {
      // Nếu thanh toán không thành công, trả về thông báo lỗi
      res.status(400).json({ message: "Payment not completed", captureData });
    }
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ message: "Error capturing payment" });
  }
});

export default routerPaypal;
