import express from "express";
import cors from "cors";
import connectDB from "./config/db/connectDB.js";
import productRouter from "./routers/productRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import colorRouter from "./routers/colorRouter.js";
import environmentRouter from "./routers/environmentRouter.js";
import cartRouter from "./routers/cartRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";
import commentRouter from "./routers/commentRouter.js";
import couponRouter from "./routers/couponRouter.js";
import checkoutRouter from "./routers/checkoutRouter.js";
import classificationRouter from "./routers/classificationRouter.js";
import searchRouter from "./routers/searchRouter.js";
import fillterRouter from "./routers/fillter.js";
import addressRouter from "./routers/addressRouter.js";
import routerPaypal from "./routers/paypalRouter.js";
import contactRouter from "./routers/contactRouter.js";

/* import commentRouter from "./routers/commentRouter.js";
import cartRouter from "./routers/cartRouter.js"; */

dotenv.config();

//app config
const app = express();
const port = 2000;

// middleware
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//kết nối databases
connectDB();
// Api endpoint

app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/color", colorRouter);
app.use("/api/environment", environmentRouter);
app.use("/api/cart", cartRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/comment", commentRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/classification", classificationRouter);
app.use("/api/address", addressRouter);
app.use("/api/contact", contactRouter);

app.use("/api/search", searchRouter);
app.use("/api/fillter", fillterRouter);
app.use("/api/paypal", routerPaypal);

//chưa test server
/* app.use("/api/comment", commentRouter);
app.use("/api/cart", cartRouter); */

app.use("/images", express.static(path.join(__dirname, "uploads")));

//test server
app.get("/", (req, res) => {
  res.send("API was successful");
});

// Kiểm tra giá trị biến môi trường

app.listen(port, (req, res) => {
  console.log(`listening on http://localhost:${port}`);
});
