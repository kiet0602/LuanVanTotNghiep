import express from "express";

import { checkout } from "../controller/orderController.js";

const checkoutRouter = express.Router();

// Route cho Color
//cartRouter.get("/getAllcolor", getAllColors);
checkoutRouter.post("/checkOut", checkout);
// checkoutRouter.post("/AddToCart", addToCart);
// checkoutRouter.post("/updateProductFromCart", updateItemQuantity);
// checkoutRouter.post("/deleteProductFromCart", removeFromCart);

export default checkoutRouter;
