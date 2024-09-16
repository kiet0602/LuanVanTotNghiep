import express from "express";
import { searchProducts } from "../controller/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/search", searchProducts);

export default searchRouter;
