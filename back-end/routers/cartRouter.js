import express from "express";
import {
  addToCart,
  getCartById,
  removeFromCart,
  updateItemQuantity,
} from "../controller/cartController.js";

const cartRouter = express.Router();

// Route cho Color
//cartRouter.get("/getAllcolor", getAllColors);
cartRouter.get("/getProductFromCart/:userId", getCartById);
cartRouter.post("/AddToCart", addToCart);
cartRouter.post("/updateProductFromCart", updateItemQuantity);
cartRouter.post("/deleteProductFromCart", removeFromCart);

export default cartRouter;
