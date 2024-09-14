import express from "express";
import {
  createClassification,
  deleteClassification,
  getClassificationById,
  getClassifications,
  updateClassification,
} from "../controller/classificationController.js";

const classificationRouter = express.Router();

// Route cho Color
classificationRouter.get("/getAllClassifications", getClassifications);
classificationRouter.get("/getClassifications/:id", getClassificationById);
classificationRouter.post("/AddClassifications", createClassification);
classificationRouter.put("/updateClassifications/:id", updateClassification);
classificationRouter.delete("/deleteClassifications/:id", deleteClassification);

export default classificationRouter;
