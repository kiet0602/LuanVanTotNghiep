import express from "express";
import {
  addFavoriteProduct,
  removeFavoriteProduct,
  getAllFavoriteProducts,
} from "../controller/favoriteController.js";
import { Auth } from "../middleware/auth.js";

const favoriteRouter = express.Router();

// Route thêm sản phẩm vào danh sách yêu thích
favoriteRouter.post("/users/favorite/:productId", Auth, addFavoriteProduct);
// Route xóa sản phẩm khỏi danh sách yêu thích
favoriteRouter.delete(
  "/users/favorite/:productId",
  Auth,
  removeFavoriteProduct
);
// Route lấy tất cả sản phẩm yêu thích của người dùng
favoriteRouter.get("/users/favorites", Auth, getAllFavoriteProducts);

export default favoriteRouter;
