import express from "express";
import cors from "cors";
import connectDB from "./config/db/connectDB.js";
import productRouter from "./routers/productRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import characteristicRouter from "./routers/characteristicRouter.js";
import imageRouter from "./routers/imageRouter.js";
import variantRouter from "./routers/variantRouter.js";
import colorRouter from "./routers/colorRouter.js";

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
app.use("/api/characteristic", characteristicRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/variant", variantRouter);
app.use("/api/color", colorRouter);

app.use("/images", express.static(path.join(__dirname, "uploads")));

//test server
app.get("/", (req, res) => {
  res.send("API was successful");
});

app.listen(port, (req, res) => {
  console.log(`listening on http://localhost:${port}`);
});
