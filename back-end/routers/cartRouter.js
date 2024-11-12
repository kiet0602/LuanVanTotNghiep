import express from "express";
import {
  addToCart,
  getCartById,
  removeFromCart,
  updateItemQuantity,
} from "../controller/cartController.js";
import { Auth } from "../middleware/auth.js";

const cartRouter = express.Router();

// Route cho Color
//cartRouter.get("/getAllcolor", getAllColors);
cartRouter.get("/getProductFromCart", Auth, getCartById);
cartRouter.post("/AddToCart", Auth, addToCart);
cartRouter.post("/updateProductFromCart", Auth, updateItemQuantity);
cartRouter.post("/deleteProductFromCart", Auth, removeFromCart);

export default cartRouter;
