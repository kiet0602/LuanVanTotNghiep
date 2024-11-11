import express from "express";
import {
  createImport,
  deleteImport,
  updateImport,
  getAllImports,
} from "../controller/importController.js";

const importRouter = express.Router();

importRouter.post("/createImport", createImport);
importRouter.put("/updateImport", updateImport);
importRouter.delete("/deleteImport", deleteImport);
importRouter.get("/getAllImport", getAllImports);

export default importRouter;
