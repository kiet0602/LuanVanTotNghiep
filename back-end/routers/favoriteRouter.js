import express from "express";
import {
  addFavoriteProduct,
  removeFavoriteProduct,
  getAllFavoriteProducts,
} from "../controller/favoriteController.js";

const favoriteRouter = express.Router();

// Route thêm sản phẩm vào danh sách yêu thích
favoriteRouter.post("/users/:userId/favorite/:productId", addFavoriteProduct);

// Route xóa sản phẩm khỏi danh sách yêu thích
favoriteRouter.delete(
  "/users/:userId/favorite/:productId",
  removeFavoriteProduct
);

// Route lấy tất cả sản phẩm yêu thích của người dùng
favoriteRouter.get("/users/:userId/favorites", getAllFavoriteProducts);

export default favoriteRouter;
