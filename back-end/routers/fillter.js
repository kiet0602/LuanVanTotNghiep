import express from "express";
import { searchProducts } from "../controller/searchController.js";
import { fillterProducts } from "../controller/fillterController.js";

const fillterRouter = express.Router();

fillterRouter.get("/fillter", fillterProducts);

export default fillterRouter;
