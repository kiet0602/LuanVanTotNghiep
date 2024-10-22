import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import couponModel from "../models/couponModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import AddressModel from "../models/addressModel.js";
import { sendOrderConfirmationEmail } from "./mailer.js";
import axios from "axios";
import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

export const paypalCheckout = async (req, res) => {
  const { totalPrice, items, userId, shippingAddress, selectedPaymentMethod } =
    req.body;

  // Kiểm tra dữ liệu nhận được từ client
  console.log("Received data:", req.body); // Thêm dòng này để kiểm tra

  try {
    // Kiểm tra xem items có phải là một mảng không
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào trong giỏ hàng." });
    }

    // Tạo yêu cầu thanh toán
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "VND",
            value: totalPrice.toFixed(2), // Đảm bảo giá trị là số thực
          },
          items: items.map((item) => ({
            name: item.productName,
            unit_amount: {
              currency_code: "VND",
              value: item.totalPriceItemCart.toFixed(2),
            },
            quantity: item.quantity,
          })),
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      },
    });

    const order = await client.execute(request);

    const newOrder = new orderModel({
      user: userId,
      items: items,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: selectedPaymentMethod,
      status: "Đang chờ thanh toán",
    });

    await newOrder.save();

    res.status(201).json({
      orderId: order.result.id,
      approvalLink: order.result.links[1].href,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error); // Thêm thông báo lỗi chi tiết
    if (error.response) {
      // Nếu PayPal trả về một lỗi
      console.error("PayPal error response:", error.response.data);
      return res
        .status(500)
        .json({ message: "Lỗi từ PayPal", details: error.response.data });
    }
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng với PayPal" });
  }
};

// Hàm xử lý checkout
export const checkout = async (req, res) => {
  const {
    userId,
    items, // Nhận items đã được truyền từ frontend
    totalPrice,
    shippingFee,
    discountedTotal,
    selectedShippingMethod,
    selectedPaymentMethod,
    couponCode = null,
    addressId,
  } = req.body;

  try {
    // 1. Lấy thông tin người dùng
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    // Lấy địa chỉ từ người dùng
    const address = await AddressModel.findOne({
      _id: addressId,
      user: userId,
    });
    let shippingAddress;
    if (address) {
      shippingAddress = {
        street: address.street,
        ward: address.ward,
        district: address.district,
        province: address.province,
      };
    } else {
      return res
        .status(400)
        .json({ message: "Địa chỉ giao hàng không tồn tại" });
    }

    // 2. Xử lý mã khuyến mãi (nếu có)
    let discount = 0;
    if (couponCode) {
      const coupon = await couponModel.findOne({ code: couponCode });
      if (coupon) {
        // Kiểm tra tính hợp lệ của mã giảm giá
        if (!coupon.isActive) {
          return res
            .status(400)
            .json({ message: "Mã giảm giá không còn hoạt động" });
        }
        if (coupon.expirationDate <= Date.now()) {
          return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
        }
        if (totalPrice < coupon.minimumPurchaseAmount) {
          return res
            .status(400)
            .json({ message: "Số tiền mua chưa đủ để sử dụng mã giảm giá" });
        }
        // Tính toán giảm giá
        discount = (totalPrice * coupon.discountPercentage) / 100;

        // Cập nhật số lần sử dụng của mã giảm giá
        coupon.usageCount += 1;
        coupon.maxUsage -= 1; // Giảm maxUsage mỗi khi mã được sử dụng
        if (coupon.usageCount >= coupon.maxUsage) {
          coupon.isActive = false; // Vô hiệu hóa mã khuyến mãi nếu đã sử dụng đủ số lần
        }
        try {
          await coupon.save(); // Lưu thay đổi
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Lỗi khi cập nhật mã giảm giá" });
        }
      } else {
        return res.status(400).json({ message: "Mã giảm giá không hợp lệ" });
      }
    }
    // 3. Tạo đơn hàng
    const order = new orderModel({
      user: userId,
      items: items.map((item) => ({
        product: item.product, // Đã được truyền từ frontend
        quantity: item.quantity,
        price: item.totalPriceItemCart, // Giá từng sản phẩm đã được tính từ frontend
      })),
      totalPrice: totalPrice, // Tổng giá trước khi giảm giá
      shippingFee: shippingFee, // Phí vận chuyển
      shippingMethod: selectedShippingMethod, // Phương thức vận chuyển
      discount: discount, // Số tiền giảm giá
      finalPrice: discountedTotal, // Tổng giá sau khi giảm giá
      shippingAddress, // Lưu đối tượng thay vì chuỗi
      paymentMethod: selectedPaymentMethod, // Phương thức thanh toán
      status: "Chờ xử lý", // Trạng thái đơn hàng
    });
    await order.save();
    // await sendOrderConfirmationEmail(user.email, order);
    // 4. Xóa các mục đã được chọn trong giỏ hàng
    for (const item of items) {
      await cartModel.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: item.product } } } // Xóa mục có product tương ứng
      );
    }
    // 5. Cập nhật số lượng sản phẩm sau khi đặt hàng
    for (const item of items) {
      await productModel.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity, orderCount: item.quantity },
      });
    }
    res.status(201).json({ message: "Checkout thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm tạo access token cho PayPal
async function generateAccessToken() {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
  });
  return response.data.access_token;
}
//hàm thay đổi trạng thái đơn hàng
export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updates = req.body;

  try {
    // Kiểm tra các trường hợp hợp lệ cho giá cuối cùng
    if (updates.finalPrice !== undefined && updates.finalPrice < 0) {
      return res.status(400).json({ message: "Giá cuối cùng không hợp lệ" });
    }

    // Kiểm tra trạng thái hợp lệ
    if (updates.status !== undefined) {
      const validStatuses = [
        "Chờ xử lý",
        "Đang xử lý",
        "Đang giao hàng",
        "Đã nhận hàng",
        "Đã hủy",
      ];
      if (!validStatuses.includes(updates.status)) {
        return res
          .status(400)
          .json({ message: "Trạng thái đơn hàng không hợp lệ" });
      }
    }

    // Cập nhật đơn hàng theo ID
    const order = await orderModel.findByIdAndUpdate(orderId, updates, {
      new: true, // Trả về đơn hàng đã được cập nhật
    });

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Nếu trạng thái là "Đã nhận hàng", cập nhật thông tin người dùng
    if (updates.status === "Đã nhận hàng") {
      const totalAmount = order.finalPrice;
      const totalProducts = order.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // Cập nhật số tiền và số sản phẩm đã mua cho người dùng
      await userModel.findByIdAndUpdate(
        order.user,
        {
          $inc: {
            totalAmountSpent: totalAmount, // Cộng thêm tổng tiền của đơn hàng
            totalProductsPurchased: totalProducts, // Cộng thêm số sản phẩm đã mua
          },
        },
        { new: true } // Trả về document đã được cập nhật
      );
    }

    res.status(200).json({ message: "Cập nhật đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Hàm xóa đơn hàng
export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Hàm lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Lấy đơn hàng theo ID và populate toàn bộ thông tin người dùng
    const order = await orderModel.findById(orderId).populate("user"); // Populate toàn bộ thông tin của người dùng

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//hàm lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    // Lấy tất cả các đơn hàng, populate thông tin người dùng và sản phẩm, và sắp xếp theo ngày tạo (createdAt) mới nhất
    const orders = await orderModel
      .find()
      .populate("user")
      .populate({
        path: "items.product", // Populate thông tin sản phẩm từ items.product
      })
      .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Service
// Hàm lấy danh sách đơn hàng của người dùng
export const getOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Lấy tất cả đơn hàng của người dùng và populate toàn bộ thông tin người dùng và sản phẩm
    const orders = await orderModel.find({ user: userId }).populate("user"); // Populate toàn bộ thông tin của user

    if (orders.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// hàm lấy danh thu
export const getRevenue = async (req, res) => {
  try {
    // Lấy tất cả các đơn hàng và populate thông tin người dùng
    const orders = await orderModel.find().populate("user"); // Populate thông tin người dùng
    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }
    // Tính tổng doanh thu bằng cách cộng dồn tất cả các giá trị đơn hàng
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.finalPrice,
      0
    );
    res.status(200).json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//hàm lấy doanh thu mỗi tháng
export const getMonthlyRevenue = async (req, res) => {
  try {
    const revenueByMonth = await orderModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }, // Nhóm theo tháng
            year: { $year: "$createdAt" }, // Nhóm theo năm (nếu cần)
          },
          totalRevenue: { $sum: "$totalPrice" }, // Tính tổng doanh thu mỗi tháng
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sắp xếp theo năm và tháng tăng dần
      },
    ]);

    // Chuyển đổi dữ liệu thành định dạng mong muốn
    const salesData = revenueByMonth.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return {
        name: monthNames[item._id.month - 1], // Đổi số tháng thành tên tháng
        sales: item.totalRevenue,
      };
    });

    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Hàm lấy số lượng sản phẩm bán theo loại
export const getSoldProductCountByCategory = async (req, res) => {
  try {
    const result = await orderModel.aggregate([
      {
        $unwind: "$items", // Tách từng sản phẩm trong items
      },
      {
        $lookup: {
          from: "products", // Liên kết với collection product
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Tách từng sản phẩm đã liên kết
      },
      {
        $group: {
          _id: "$productDetails.category", // Nhóm theo thể loại sản phẩm
          totalQuantity: { $sum: "$items.quantity" }, // Tổng số lượng sản phẩm bán ra
        },
      },
      {
        $lookup: {
          from: "categories", // Liên kết với collection category
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails", // Tách từng thể loại đã liên kết
      },
      {
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.categoryName", // Hiển thị tên thể loại
          totalQuantity: 1,
        },
      },
      {
        $sort: { totalQuantity: -1 }, // Sắp xếp theo số lượng giảm dần
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Lấy doanh số đơn hàng đang chờ xử lý
export const getPending = async (req, res) => {
  try {
    // Các trạng thái cần lấy: Pending và Completed
    const statusList = ["Chờ xử lý", "Đang xử lý", "Đang giao hàng"];

    // Tìm đơn hàng có trạng thái thuộc danh sách trên và populate thông tin người dùng
    const orders = await orderModel
      .find({ status: { $in: statusList } })
      .populate("user");

    // Nếu không có đơn hàng, trả về mảng rỗng thay vì lỗi
    if (orders.length === 0) {
      return res.status(200).json([]); // Trả về mảng rỗng
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Lấy doanh số đơn hàng Đã hoàn thành
export const getCompleted = async (req, res) => {
  try {
    // Các trạng thái cần lấy: Đã nhận hàng
    const statusList = ["Đã nhận hàng"];

    // Tìm đơn hàng có trạng thái thuộc danh sách trên và populate thông tin người dùng
    const orders = await orderModel
      .find({ status: { $in: statusList } })
      .populate("user");

    // Nếu không có đơn hàng, trả về mảng rỗng thay vì lỗi
    if (orders.length === 0) {
      return res.status(200).json([]); // Trả về mảng rỗng
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//hàm lấy số lượng đơn hàng của các trạng thái
export const getOrderCountByStatus = async (req, res) => {
  try {
    // Danh sách các trạng thái đơn hàng cần đếm
    const statusList = [
      "Chờ xử lý",
      "Đang xử lý",
      "Đang giao hàng",
      "Đã nhận hàng",
      "Đã hủy",
    ];

    // Tạo danh sách các promise để đếm số lượng đơn hàng theo từng trạng thái
    const orderCounts = await Promise.all(
      statusList.map(async (status) => {
        const count = await orderModel.countDocuments({ status: status });
        return { status, count };
      })
    );

    // Trả về kết quả
    res.status(200).json(orderCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Hàm lấy số lượng đơn hàng theo ngày
export const getOrderCountByDate = async (req, res) => {
  try {
    // Sử dụng aggregate để nhóm đơn hàng theo ngày và đếm số lượng đơn hàng
    const ordersCountByDate = await orderModel.aggregate([
      {
        // Chuyển đổi trường createdAt thành ngày
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }, // Đếm số lượng đơn hàng trong mỗi ngày
        },
      },
      {
        // Sắp xếp theo ngày
        $sort: { _id: 1 },
      },
    ]);

    if (ordersCountByDate.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }

    // Chuyển đổi dữ liệu sang định dạng mong muốn
    const dailyOrdersData = ordersCountByDate.map((order) => ({
      date: order._id.slice(5), // Lấy phần ngày tháng từ định dạng YYYY-MM-DD
      orders: order.count, // Sử dụng trường count để lưu số lượng đơn hàng
    }));

    res.status(200).json(dailyOrdersData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Hủy đơn hàng
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Tìm kiếm đơn hàng theo ID
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra trạng thái đơn hàng có thể hủy hay không
    const cancellableStatuses = [
      "Chờ xử lý", // Chỉ cho phép hủy đơn hàng ở trạng thái này
    ];
    if (!cancellableStatuses.includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Không thể hủy đơn hàng trong trạng thái này" });
    }

    // Cập nhật trạng thái đơn hàng thành "Đã hủy"
    order.status = "Đã hủy";
    await order.save();

    res.status(200).json({ message: "Hủy đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Nhận hàng
export const receiveOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Tìm kiếm đơn hàng theo ID
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra trạng thái đơn hàng có thể nhận hay không
    const receivableStatuses = [
      "Đang giao hàng", // Chỉ cho phép nhận đơn hàng ở trạng thái này
    ];
    if (!receivableStatuses.includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Không thể nhận đơn hàng trong trạng thái này" });
    }

    // Cập nhật trạng thái đơn hàng thành "Đã nhận hàng"
    order.status = "Đã nhận hàng";
    await order.save();

    res.status(200).json({ message: "Nhận đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
