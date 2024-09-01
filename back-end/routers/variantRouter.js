import express from "express";
import {
  createVariant,
  getAllVariants,
  getVariantById,
  updateVariantById,
  deleteVariantById,
} from "../controller/variantController.js";

const variantRouter = express.Router();

// Route để tạo Variant mới
variantRouter.post("/addVariants", createVariant);

// Route để lấy tất cả Variants
variantRouter.get("/getAllVariants", getAllVariants);

// Route để lấy Variant theo ID
variantRouter.get("/getVariants/:id", getVariantById);

// Route để cập nhật Variant theo ID
variantRouter.put("/updateVariants/:id", updateVariantById);

// Route để xóa Variant theo ID
variantRouter.delete("/deleteVariants/:id", deleteVariantById);

export default variantRouter;
