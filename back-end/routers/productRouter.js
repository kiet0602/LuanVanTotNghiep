import express from "express";
import upload from "../configImage/multer.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  updateProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/addProduct", upload.array("image", 5), addProduct);
productRouter.put("/updateProduct/:id", upload.array("image"), updateProduct);
productRouter.delete("/deleteProduct/:id", deleteProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getProductById/:id", getProductById);
productRouter.get(
  "/getProductByCategoryId/:categoryId",
  getProductsByCategoryId
);

export default productRouter;
