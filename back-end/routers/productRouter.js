import express from "express";
import upload from "../configImage/multer.js";
import {
  addProduct,
  deleteProduct,
  getAllProductLowQuantity,
  getAllProducts,
  getAllProductsDiscount,
  getProductByName,
  getProductsByCategoryId,
  getTopSellingProducts,
  updateProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post(
  "/addProduct",
  upload.fields([
    { name: "image", maxCount: 5 }, // Tối đa 5 ảnh
    { name: "video", maxCount: 1 }, // Tối đa 1 video
  ]),
  addProduct
);

productRouter.put(
  "/updateProduct/:id",
  upload.fields([
    { name: "image", maxCount: 5 }, // Tối đa 5 ảnh
    { name: "video", maxCount: 1 }, // Tối đa 1 video
  ]),
  updateProduct
);

productRouter.delete("/deleteProduct/:id", deleteProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsDiscount", getAllProductsDiscount);
productRouter.get("/getProductByName/:productName", getProductByName);
productRouter.get(
  "/getProductByCategoryId/:categoryId",
  getProductsByCategoryId
);
productRouter.get("/getTopSellingProducts", getTopSellingProducts);
productRouter.get("/getAllProductLowQuantity", getAllProductLowQuantity);

export default productRouter;
