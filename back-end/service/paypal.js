import axios from "axios";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Hàm để lấy access token từ PayPal
async function generateAccessToken() {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET,
    },
  });

  return response.data.access_token;
}
export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  const order = await orderModel.findOneAndUpdate(
    { paypalOrderId: orderId }, // Tìm kiếm đơn hàng bằng orderId của PayPal
    { new: true }
  );

  return response.data;
}

export async function createOrder(orderData) {
  try {
    const accessToken = await generateAccessToken();
    console.log("AccessToken nhận được:", accessToken);

    // Tính toán tổng giá trị mặt hàng
    const itemTotal = orderData.items
      .reduce((sum, item) => {
        const unitPrice = (item.totalPriceItemCart / 23000).toFixed(2);
        return sum + parseFloat(unitPrice) * item.quantity;
      }, 0)
      .toFixed(2);

    // Tính phí vận chuyển
    const shippingFee = (orderData.shippingFee / 23000).toFixed(2);
    const finalPrice = (
      parseFloat(itemTotal) + parseFloat(shippingFee)
    ).toFixed(2);

    // Dữ liệu để gửi lên PayPal
    const data = {
      intent: "CAPTURE",
      purchase_units: [
        {
          items: orderData.items.map((item) => ({
            name: item.product.productName,
            quantity: item.quantity,
            unit_amount: {
              currency_code: "USD",
              value: (item.totalPriceItemCart / 23000).toFixed(2),
            },
          })),
          amount: {
            currency_code: "USD",
            value: finalPrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemTotal,
              },
              shipping: {
                currency_code: "USD",
                value: shippingFee,
              },
            },
          },
        },
      ],
      application_context: {
        return_url: process.env.FRONTEND_URL + "/complete-order",
        cancel_url: process.env.FRONTEND_URL + "/cancel-order",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "manfra.io",
      },
    };

    // Gửi yêu cầu tạo đơn hàng lên PayPal
    console.log("Dữ liệu gửi lên PayPal:", JSON.stringify(data, null, 2));
    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: JSON.stringify(data),
    });

    // Lấy orderId và approveLink từ phản hồi của PayPal
    const orderId = response.data.id;
    const approveLink = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    console.log("Order ID nhận được từ PayPal:", orderId);
    console.log("Approve link nhận được:", approveLink);

    // Tạo đơn hàng mới và lưu orderId vào cơ sở dữ liệu
    const newOrder = new orderModel({
      user: orderData.userId,
      items: orderData.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: (item.totalPriceItemCart / 23000).toFixed(2), // Lưu giá của từng sản phẩm vào đơn hàng
      })),
      totalPrice: orderData.totalPrice, // Tổng giá trị VND của đơn hàng
      shippingFee: orderData.shippingFee, // Phí vận chuyển VND
      shippingMethod: orderData.selectedShippingMethod, // Phương thức vận chuyển
      finalPrice: finalPrice, // Tổng giá trị USD sau khi tính phí vận chuyển
      shippingAddress: orderData.addressId ? orderData.addressId : null, // Địa chỉ giao hàng (nếu có)
      paymentMethod: "PayPal", // Phương thức thanh toán
      status: "Chờ xử lý", // Trạng thái đơn hàng
      paypalOrderId: orderId, // Lưu PayPal orderId để sử dụng trong các bước tiếp theo
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();
    console.log(
      "Đơn hàng đã được lưu vào cơ sở dữ liệu với PayPal orderId:",
      orderId
    );

    // Cập nhật giỏ hàng và số lượng sản phẩm
    await Promise.all(
      orderData.items.map(async (item) => {
        // Xóa sản phẩm đã đặt từ giỏ hàng
        await cartModel.findOneAndUpdate(
          { user: orderData.userId },
          { $pull: { items: { product: item.product } } } // Xóa sản phẩm có product tương ứng
        );

        // Cập nhật số lượng sản phẩm trong kho
        await productModel.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity, orderCount: item.quantity },
        });
      })
    );

    console.log("Cập nhật giỏ hàng và số lượng sản phẩm thành công.");

    // Trả về liên kết phê duyệt và orderId
    return {
      approveLink,
      orderId,
    };
  } catch (error) {
    console.error(
      "Lỗi trong quá trình tạo đơn hàng:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error creating order");
  }
}
