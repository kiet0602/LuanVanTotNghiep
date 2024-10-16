import { parse, format, parseISO, isValid } from "date-fns";
import couponModel from "../models/couponModel.js";
import userModel from "../models/userModel.js";

export const createCoupon = async (req, res) => {
  const {
    code,
    discountPercentage,
    startDate,
    expirationDate,
    minimumPurchaseAmount,
    isActive,
    maxUsage,
  } = req.body;

  try {
    // Chuyển đổi ngày từ DD-MM-YYYY sang Date object
    const parsedStartDate = parse(startDate, "dd-MM-yyyy", new Date());
    const parsedExpirationDate = parse(
      expirationDate,
      "dd-MM-yyyy",
      new Date()
    );

    // Kiểm tra tính hợp lệ của ngày
    if (!isValid(parsedStartDate)) {
      return res.status(400).json({ message: "Ngày bắt đầu không hợp lệ." });
    }
    if (!isValid(parsedExpirationDate)) {
      return res.status(400).json({ message: "Ngày hết hạn không hợp lệ." });
    }

    // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
    if (parsedExpirationDate < parsedStartDate) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải sau ngày bắt đầu!" });
    }

    // Tạo mã khuyến mãi mới
    const newCoupon = new couponModel({
      code,
      discountPercentage,
      startDate: parsedStartDate, // Lưu đối tượng Date
      expirationDate: parsedExpirationDate, // Lưu đối tượng Date
      minimumPurchaseAmount,
      isActive,
      maxUsage,
      usedBy: [], // Khởi tạo mảng danh sách người dùng đã sử dụng
    });

    // Lưu mã khuyến mãi vào database
    const savedCoupon = await newCoupon.save();

    // Format lại ngày trước khi trả về
    const formattedCoupon = {
      ...savedCoupon._doc,
      startDate: format(savedCoupon.startDate, "dd-MM-yyyy"),
      expirationDate: format(savedCoupon.expirationDate, "dd-MM-yyyy"),
    };

    // Trả về phản hồi với mã khuyến mãi đã tạo và ngày tháng đã được định dạng
    res.status(201).json(formattedCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating coupon.", error });
  }
};
// Lấy tất cả mã khuyến mãi
export const getAllCoupons = async (req, res) => {
  try {
    // Lấy các coupon chưa có useBy
    const coupons = await couponModel.find({ usedBy: [] });

    // Chuyển đổi ngày từ đối tượng Date sang DD-MM-YYYY
    const formattedCoupons = coupons.map((coupon) => ({
      ...coupon._doc,
      startDate: format(new Date(coupon.startDate), "dd-MM-yyyy"),
      expirationDate: format(new Date(coupon.expirationDate), "dd-MM-yyyy"),
    }));

    res.status(200).json(formattedCoupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching coupons.", error });
  }
};
export const getUserCoupons = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ tham số URL

  try {
    // Tìm người dùng
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Lấy các coupon mà người dùng đã nhận
    const coupons = await couponModel.find({ usedBy: userId });

    // Chuyển đổi ngày từ đối tượng Date sang DD-MM-YYYY
    const formattedCoupons = coupons.map((coupon) => ({
      ...coupon._doc,
      startDate: format(new Date(coupon.startDate), "dd-MM-yyyy"),
      expirationDate: format(new Date(coupon.expirationDate), "dd-MM-yyyy"),
    }));

    res.status(200).json(formattedCoupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user coupons.", error });
  }
};
// Lấy một mã khuyến mãi theo ID
export const getCouponById = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await couponModel.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }
    // Chuyển đổi ngày từ đối tượng Date sang DD-MM-YYYY
    coupon.startDate = format(new Date(coupon.startDate), "dd-MM-yyyy");
    coupon.expirationDate = format(
      new Date(coupon.expirationDate),
      "dd-MM-yyyy"
    );

    res.status(200).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving coupon.", error });
  }
};
// Xóa mã khuyến mãi theo ID
export const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoupon = await couponModel.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json({ message: "Coupon deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting coupon.", error });
  }
};
// Cập nhật mã khuyến mãi theo ID
export const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const {
    code,
    discountPercentage,
    startDate,
    expirationDate,
    minimumPurchaseAmount,
    isActive,
    maxUsage,
  } = req.body;

  try {
    // Lấy mã khuyến mãi hiện tại để kiểm tra ngày
    const existingCoupon = await couponModel.findById(id);

    if (!existingCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    // Chuyển đổi ngày từ DD-MM-YYYY sang Date object nếu có
    const parsedStartDate = startDate
      ? new Date(startDate) // Chuyển đổi từ 'YYYY-MM-DD' sang Date object
      : existingCoupon.startDate;

    const parsedExpirationDate = expirationDate
      ? new Date(expirationDate) // Chuyển đổi từ 'YYYY-MM-DD' sang Date object
      : existingCoupon.expirationDate;

    // Kiểm tra tính hợp lệ của ngày
    if (startDate && !isValid(parsedStartDate)) {
      return res.status(400).json({ message: "Ngày bắt đầu không hợp lệ." });
    }
    if (expirationDate && !isValid(parsedExpirationDate)) {
      return res.status(400).json({ message: "Ngày hết hạn không hợp lệ." });
    }

    // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
    if (parsedExpirationDate < parsedStartDate) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải sau ngày bắt đầu!" });
    }

    // Cập nhật mã khuyến mãi
    const updatedCoupon = await couponModel.findByIdAndUpdate(
      id,
      {
        code,
        discountPercentage,
        startDate: parsedStartDate, // Lưu đối tượng Date
        expirationDate: parsedExpirationDate, // Lưu đối tượng Date
        minimumPurchaseAmount,
        isActive,
        maxUsage,
      },
      { new: true }
    );

    // Định dạng lại ngày trước khi trả về frontend
    const formattedCoupon = {
      ...updatedCoupon._doc,
      startDate: format(new Date(updatedCoupon.startDate), "dd-MM-yyyy"),
      expirationDate: format(
        new Date(updatedCoupon.expirationDate),
        "dd-MM-yyyy"
      ),
    };

    res.status(200).json(formattedCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating coupon.", error });
  }
};

export const applyCoupon = async (req, res) => {
  const { couponCode, totalPrice } = req.body;

  try {
    // Tìm mã khuyến mãi
    const coupon = await couponModel.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(400).json({ message: "Mã khuyến mãi không hợp lệ" });
    }

    // Kiểm tra mã khuyến mãi có đang hoạt động không
    if (!coupon.isActive) {
      return res
        .status(400)
        .json({ message: "Mã khuyến mãi không còn hiệu lực" });
    }

    // Kiểm tra mã khuyến mãi có hết hạn không
    if (new Date() > coupon.expirationDate) {
      return res.status(400).json({ message: "Mã khuyến mãi đã hết hạn" });
    }

    // Kiểm tra tổng giá có đủ điều kiện áp dụng không
    if (totalPrice < coupon.minimumPurchaseAmount) {
      return res
        .status(400)
        .json({ message: "Tổng giá không đủ điều kiện áp dụng mã khuyến mãi" });
    }

    // Tính toán giảm giá
    const discountAmount = (totalPrice * coupon.discountPercentage) / 100;
    const finalPrice = totalPrice - discountAmount;

    res.status(200).json({
      discountAmount,
      finalPrice,
      message: "Mã khuyến mãi đã được áp dụng thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};
