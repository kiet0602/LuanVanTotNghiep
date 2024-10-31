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

productRouter.post("/addProduct", upload.array("image", 5), addProduct);
productRouter.put(
  "/updateProduct/:id",
  upload.array("image", 5),
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
