import express from "express";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  getUserCoupons,
  updateCoupon,
} from "../controller/couponController.js";
import { sendVoucherEmail } from "../controller/mailer.js";

const couponRouter = express.Router();

couponRouter.post("/addCoupon", createCoupon);
couponRouter.get("/getAllCoupon", getAllCoupons);
couponRouter.get("/getCouponById/:id", getCouponById);
couponRouter.delete("/deleteCoupon/:id", deleteCoupon);
couponRouter.put("/updateCoupon/:id", updateCoupon);
couponRouter.get("/getUserCoupons/:userId", getUserCoupons);

couponRouter.post("/send-coupon", sendVoucherEmail);
couponRouter.post("/coupon-apply", applyCoupon);

export default couponRouter;
