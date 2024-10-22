import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsByProduct,
  updateComment,
} from "../controller/commentController.js";
import { Auth } from "../middleware/auth.js";

const commentRouter = express.Router();

commentRouter.post("/products/:productId/comments", Auth, addComment);
commentRouter.post("/products/:productId/comments/:parentId", Auth, addComment);
commentRouter.delete("/comments/:commentId", Auth, deleteComment);
commentRouter.put("/comments/:commentId", Auth, updateComment);
commentRouter.get("/products/:productId/comments", getCommentsByProduct);

export default commentRouter;
