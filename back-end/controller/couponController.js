import { parse, format, parseISO } from "date-fns";
import couponModel from "../models/couponModel.js";

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
    // Chuyển đổi ngày từ DD-MM-YYYY sang ISO 8601
    const isoStartDate = format(
      parse(startDate, "dd-MM-yyyy", new Date()),
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );
    const isoExpirationDate = format(
      parse(expirationDate, "dd-MM-yyyy", new Date()),
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

    // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
    if (new Date(isoExpirationDate) < new Date(isoStartDate)) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải sau ngày bắt đầu!" });
    }

    const newCoupon = new couponModel({
      code,
      discountPercentage,
      startDate: isoStartDate,
      expirationDate: isoExpirationDate,
      minimumPurchaseAmount,
      isActive,
      maxUsage,
      usedBy: [], // Khởi tạo mảng danh sách người dùng đã sử dụng
    });

    const savedCoupon = await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully.", coupon: savedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating coupon.", error });
  }
};
// Lấy tất cả mã khuyến mãi
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find();
    // Chuyển đổi ngày từ đối tượng Date sang DD-MM-YYYY
    const formattedCoupons = coupons.map((coupon) => ({
      ...coupon._doc,
      startDate: format(new Date(coupon.startDate), "dd-MM-yyyy"),
      expirationDate: format(new Date(coupon.expirationDate), "dd-MM-yyyy"),
    }));

    res.status(200).json({ coupons: formattedCoupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching coupons.", error });
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

  // Chuyển đổi ngày từ DD-MM-YYYY sang ISO 8601 nếu có
  const isoStartDate = startDate
    ? format(
        parse(startDate, "dd-MM-yyyy", new Date()),
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      )
    : undefined;
  const isoExpirationDate = expirationDate
    ? format(
        parse(expirationDate, "dd-MM-yyyy", new Date()),
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      )
    : undefined;

  try {
    // Lấy mã khuyến mãi hiện tại để kiểm tra ngày
    const existingCoupon = await couponModel.findById(id);

    if (!existingCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
    if (
      isoStartDate &&
      isoExpirationDate &&
      new Date(isoExpirationDate) < new Date(isoStartDate)
    ) {
      return res
        .status(400)
        .json({ message: "Expiration date must be after the start date." });
    }

    const updatedCoupon = await couponModel.findByIdAndUpdate(
      id,
      {
        code,
        discountPercentage,
        ...(isoStartDate && { startDate: isoStartDate }),
        ...(isoExpirationDate && { expirationDate: isoExpirationDate }),
        minimumPurchaseAmount,
        isActive,
        maxUsage,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Coupon updated successfully.", coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating coupon.", error });
  }
};
