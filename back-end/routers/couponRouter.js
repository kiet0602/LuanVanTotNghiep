import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
} from "../controller/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/addCoupon", createCoupon);
couponRouter.get("/getAllCoupon", getAllCoupons);
couponRouter.get("/getCouponById/:id", getCouponById);
couponRouter.delete("/deleteCoupon", deleteCoupon);
couponRouter.put("/updateCoupon/:id", updateCoupon);

export default couponRouter;
