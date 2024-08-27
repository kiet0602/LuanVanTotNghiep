import express from "express";
import { addCategory } from "../controller/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/addCategory", addCategory);

export default categoryRouter;
