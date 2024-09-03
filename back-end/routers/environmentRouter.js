// environmentRoutes.js
import express from "express";
import {
  getAllEnvironments,
  getEnvironmentById,
  createEnvironment,
  updateEnvironmentById,
  deleteEnvironmentById,
} from "../controller/environmentController.js"; // Đường dẫn đúng tới file controller

const environmentRouter = express.Router();

// Định nghĩa các route và gán với các controller tương ứng
environmentRouter.get("/getAllEnvironments", getAllEnvironments);
environmentRouter.get("/getEnvironments/:id", getEnvironmentById);
environmentRouter.post("/addEnvironments", createEnvironment);
environmentRouter.put("/updateEnvironments/:id", updateEnvironmentById);
environmentRouter.delete("/deleteEnvironments/:id", deleteEnvironmentById);

export default environmentRouter;
