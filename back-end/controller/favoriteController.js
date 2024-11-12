import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Sửa addFavoriteProduct để lấy userId từ req.user
export const addFavoriteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.user; // Lấy userId từ req.user sau khi qua Auth

    // Tìm kiếm user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send("Không tìm thấy người dùng!");

    // Kiểm tra nếu sản phẩm đã được yêu thích
    if (user.favoritesProducts.includes(productId)) {
      return res.status(400).send("Sản phẩm này bạn đã thích!");
    }

    // Thêm sản phẩm vào danh sách yêu thích
    user.favoritesProducts.push(productId);
    await user.save();

    // Tìm kiếm sản phẩm và cập nhật số lượng yêu thích
    const product = await productModel.findById(productId);
    if (product) {
      product.favoriteCount += 1; // Tăng số lượng yêu thích
      await product.save();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const removeFavoriteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.user; // Lấy userId từ req.user

    // Tìm kiếm user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send("Không tìm thấy người dùng!");

    // Kiểm tra nếu sản phẩm có trong danh sách yêu thích
    if (!user.favoritesProducts.includes(productId)) {
      return res
        .status(400)
        .send("Sản phẩm không có trong danh sách yêu thích");
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    user.favoritesProducts = user.favoritesProducts.filter(
      (favProductId) => favProductId.toString() !== productId
    );
    await user.save();

    // Tìm kiếm sản phẩm và cập nhật số lượng yêu thích
    const product = await productModel.findById(productId);
    if (product) {
      product.favoriteCount = Math.max(0, product.favoriteCount - 1); // Giảm số lượng yêu thích nhưng không nhỏ hơn 0
      await product.save();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Controller để lấy tất cả sản phẩm yêu thích
export const getAllFavoriteProducts = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy userId từ req.user

    // Tìm kiếm user và populate các sản phẩm yêu thích,
    // đồng thời populate đầy đủ các trường có ObjectId: category, color, environment
    const user = await userModel.findById(userId).populate({
      path: "favoritesProducts",
      populate: [
        { path: "category" }, // Lấy đầy đủ dữ liệu của category
        { path: "color" }, // Lấy đầy đủ dữ liệu của color
        { path: "environment" }, // Lấy đầy đủ dữ liệu của environment
      ],
    });

    if (!user) return res.status(404).send("User not found");

    // Lấy danh sách sản phẩm yêu thích và tính toán finalPrice cho từng sản phẩm
    const productsWithFinalPrice = user.favoritesProducts.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    // Trả về danh sách sản phẩm yêu thích với finalPrice và đầy đủ dữ liệu của các trường liên kết
    res.status(200).send(productsWithFinalPrice);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
