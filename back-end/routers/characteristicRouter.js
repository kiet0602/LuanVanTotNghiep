import express from "express";
import {
  addCharacteristic,
  deleteCharacteristic,
  getAllCharacteristic,
  getCharacteristicId,
  updateCharacteristic,
} from "../controller/characteristicController.js";

const characteristicRouter = express.Router();

characteristicRouter.post("/addCharacteristic", addCharacteristic);
characteristicRouter.get("/getCharacteristicID/:id", getCharacteristicId);
characteristicRouter.put("/updateCharacteristic/:id", updateCharacteristic);
characteristicRouter.get("/getAllCharacteristic", getAllCharacteristic);
characteristicRouter.delete("/deleteCharacteristic/:id", deleteCharacteristic);

export default characteristicRouter;
