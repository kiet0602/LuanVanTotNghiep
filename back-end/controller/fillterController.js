import productModel from "../models/productModel.js";

// Hàm xử lý lọc sản phẩm
export const fillterProducts = async (req, res) => {
  const { query, minPrice, maxPrice, category, sortBy } = req.query;

  try {
    const filter = {};

    // Lọc theo tên sản phẩm
    if (query) {
      filter.productName = { $regex: query, $options: "i" };
    }

    // Lọc theo category
    if (category) {
      filter.category = category;
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    // Kiểm tra filter
    console.log("Filter:", filter);

    // Sắp xếp theo tiêu chí
    const sortCriteria = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };
    console.log("Sort Criteria:", sortCriteria);

    // Thực hiện truy vấn
    const products = await productModel.find(filter).sort(sortCriteria);

    // Kiểm tra dữ liệu trả về
    console.log("Products found:", products);

    res.json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Có lỗi xảy ra" });
  }
};
