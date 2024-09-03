import express from "express";
import {
  addComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controller/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/addComments", addComment);
commentRouter.delete("/deleteComments", deleteComment);
commentRouter.put("/updateComments", updateComment);
commentRouter.get("/getAllComments", getAllComments);

export default commentRouter;
