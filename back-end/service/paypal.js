import axios from "axios";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import AddressModel from "../models/addressModel.js";
import couponModel from "../models/couponModel.js";
import moment from "moment-timezone"; // Import thư viện moment-timezone

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
  console.log("Dữ liệu nhận từ frontend:", orderData); // Kiểm tra xem couponCode có được gửi lên không
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

    // Tính toán giảm giá nếu có mã khuyến mãi
    let discount = 0;
    if (orderData.couponCode) {
      const coupon = await couponModel.findOne({ code: orderData.couponCode });
      console.log(coupon);

      if (coupon) {
        if (
          !coupon.isActive ||
          coupon.expirationDate <= Date.now() ||
          itemTotal < coupon.minimumPurchaseAmount
        ) {
          throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }
        discount = (itemTotal * coupon.discountPercentage) / 100;
        console.log(`Giảm giá tính được: ${discount.toFixed(2)}`);
      } else {
        throw new Error("Mã giảm giá không hợp lệ");
      }
    }

    const finalPrice = (
      parseFloat(itemTotal) +
      parseFloat(shippingFee) -
      discount
    ).toFixed(2);

    // Lấy địa chỉ giao hàng từ cơ sở dữ liệu
    const address = await AddressModel.findOne({
      _id: orderData.addressId,
      user: orderData.userId,
    });
    if (!address) {
      throw new Error("Địa chỉ giao hàng không tồn tại");
    }

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
              discount: {
                currency_code: "USD",
                value: discount.toFixed(2),
              },
            },
          },
          shipping: {
            address: {
              address_line_1: address.street,
              address_line_2: address.ward || "", // Thêm ward nếu có
              admin_area_2: address.district,
              admin_area_1: address.province,
              postal_code: address.postalCode || "", // Thêm mã bưu chính nếu có
              country_code: "VN", // Đặt mã quốc gia
            },
          },
        },
      ],
      application_context: {
        return_url: process.env.FRONTEND_URL + "/success",
        cancel_url: process.env.FRONTEND_URL + "/checkout",
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

    // Trả về liên kết phê duyệt và orderId mà không lưu vào cơ sở dữ liệu ngay
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

// Hàm để lưu đơn hàng vào cơ sở dữ liệu sau khi thanh toán thành công
export async function saveOrderAfterPayment(orderId, orderData) {
  try {
    const address = await AddressModel.findOne({
      _id: orderData.addressId,
      user: orderData.userId,
    });

    const totalPrice = Number(orderData.totalPrice);
    const shippingFee = Number(orderData.shippingFee) || 0; // Gán 0 nếu shippingFee không hợp lệ

    // Sử dụng giá trị discount từ mã giảm giá đã xử lý
    let discount = 0;
    if (orderData.couponCode) {
      const coupon = await couponModel.findOne({ code: orderData.couponCode });
      if (coupon && coupon.isActive && coupon.expirationDate > Date.now()) {
        discount = (totalPrice * coupon.discountPercentage) / 100;

        // Cập nhật số lần sử dụng của mã giảm giá
        coupon.usageCount += 1;
        coupon.maxUsage -= 1;
        if (coupon.usageCount >= coupon.maxUsage) {
          coupon.isActive = false; // Vô hiệu hóa mã khuyến mãi nếu đã sử dụng đủ số lần
        }
        await coupon.save(); // Lưu thay đổi
      }
    }

    // Tính toán finalPrice
    const finalPrice = totalPrice - discount + shippingFee + 20000;

    if (isNaN(finalPrice)) {
      throw new Error("Tính toán finalPrice không hợp lệ.");
    }
    const orderCreatedAt = moment().tz("Asia/Ho_Chi_Minh").toDate();
    const newOrder = new orderModel({
      user: orderData.userId,
      items: orderData.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: (item.totalPriceItemCart / 23000).toFixed(2), // Nếu cần phải chuyển đổi
      })),
      totalPrice: orderData.totalPrice,
      shippingFee: shippingFee.toString(), // Chuyển đổi shippingFee thành chuỗi nếu cần
      shippingMethod: orderData.selectedShippingMethod,
      discount: discount, // Sử dụng discount đã tính toán
      finalPrice: finalPrice, // Sử dụng giá trị đã tính toán cho finalPrice
      shippingAddress: {
        street: address.street,
        ward: address.ward,
        district: address.district,
        province: address.province,
        postalCode: address.postalCode || "",
      },
      paymentMethod: "PayPal",
      status: "Chờ xử lý",
      paypalOrderId: orderId,
      createdAt: orderCreatedAt,
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
        await cartModel.findOneAndUpdate(
          { user: orderData.userId },
          { $pull: { items: { product: item.product } } }
        );
        await productModel.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity, orderCount: item.quantity },
        });
      })
    );

    console.log("Cập nhật giỏ hàng và số lượng sản phẩm thành công.");
  } catch (error) {
    console.error("Lỗi khi lưu đơn hàng vào cơ sở dữ liệu:", error.message);
    throw new Error("Error saving order after payment");
  }
}
