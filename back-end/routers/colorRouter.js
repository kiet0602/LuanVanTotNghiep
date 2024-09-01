import express from "express";
import {
  getAllColors,
  getColorById,
  createColor,
  updateColorById,
  deleteColorById,
} from "../controller/colorController.js";

const colorRouter = express.Router();

// Route cho Color
colorRouter.get("/getAllcolor", getAllColors);
colorRouter.get("/getColor/:id", getColorById);
colorRouter.post("/AddColor", createColor);
colorRouter.put("/updateColor/:id", updateColorById);
colorRouter.delete("/deleteColor/:id", deleteColorById);

export default colorRouter;
