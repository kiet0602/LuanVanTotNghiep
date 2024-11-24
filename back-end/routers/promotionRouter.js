import express from "express";
import { createPromotion } from "../controller/promotionController.js";
const promotionRouter = express.Router();

// Route tạo chương trình khuyến mãi mới
promotionRouter.post("/createPromotion", createPromotion);

export default promotionRouter;
