import productModel from "../models/productModel.js";

export const searchProducts = async (req, res) => {
  let { query } = req.query;

  // Đảm bảo query là một chuỗi
  if (typeof query !== "string") {
    query = String(query);
  }

  try {
    // Tìm kiếm không phân biệt hoa thường
    const products = await productModel
      .find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
      .lean(); // Lấy đối tượng JS thuần

    // Tính toán finalPrice và thêm vào mỗi sản phẩm
    const productsWithFinalPrice = products.map((product) => ({
      ...product, // Sao chép tất cả các trường hiện có
      finalPrice: product.originalPrice * (1 - product.discount / 100), // Thêm trường finalPrice
    }));

    // Trả về danh sách sản phẩm bao gồm cả finalPrice
    res.status(200).json({
      products: productsWithFinalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
