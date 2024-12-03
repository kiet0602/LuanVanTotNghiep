import productModel from "../models/productModel.js";
// import các model khác nếu cần

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      environment,
      color,
      description,
      originalPrice,
      discount = 0,
      size,
      quantity, // Không gán giá trị mặc định ở đây
      care,
    } = req.body;

    // Tạo mảng để lưu trữ các trường thiếu
    const missingFields = [];

    // Kiểm tra từng trường bắt buộc
    if (!category) missingFields.push("category");
    if (!environment) missingFields.push("environment");
    if (!color) missingFields.push("color");
    if (!size) missingFields.push("size");
    if (!originalPrice) missingFields.push("originalPrice");
    if (!care) missingFields.push("care");

    // Nếu có trường thiếu, trả về thông báo lỗi cụ thể
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Thiếu trường bắt buộc: " + missingFields.join(", "),
      });
    }

    // Kiểm tra tên sản phẩm đã tồn tại
    const existingProduct = await productModel.findOne({ productName });
    if (existingProduct) {
      return res.status(400).json({ error: "Tên sản phẩm đã tồn tại" });
    }

    // Nếu `quantity` không được gửi hoặc không hợp lệ, mặc định là 0
    const validQuantity = !isNaN(quantity) && quantity >= 0 ? quantity : 0;

    // Xử lý hình ảnh và video
    const images = req.files.image
      ? req.files.image.map((file) => file.filename)
      : [];
    const video = req.files.video ? req.files.video[0].filename : null;

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      productName,
      category,
      environment,
      color,
      description,
      originalPrice,
      discount,
      size,
      quantity: validQuantity, // Gán giá trị đã xử lý
      care,
      image: images,
      video,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      environment,
      color,
      description,
      originalPrice,
      discount = 0,
      size,
      quantity, // Thêm trường quantity
      care, // Thêm trường care
    } = req.body;

    const { id } = req.params;

    // Kiểm tra sản phẩm có tồn tại
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
    }

    // Kiểm tra từng trường bắt buộc
    const missingFields = [];
    if (!category && !existingProduct.category) missingFields.push("category");
    if (!environment && !existingProduct.environment)
      missingFields.push("environment");
    if (!color && !existingProduct.color) missingFields.push("color");
    if (!size && !existingProduct.size) missingFields.push("size");
    if (!originalPrice && !existingProduct.originalPrice)
      missingFields.push("originalPrice");
    if (quantity === undefined && existingProduct.quantity === undefined)
      missingFields.push("quantity");
    if (!care && !existingProduct.care) missingFields.push("care");

    // Nếu có trường thiếu, trả về thông báo lỗi cụ thể
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Thiếu trường bắt buộc: " + missingFields.join(", "),
      });
    }

    // Kiểm tra trùng tên sản phẩm
    if (productName) {
      const productWithSameName = await productModel.findOne({ productName });
      if (productWithSameName && productWithSameName._id.toString() !== id) {
        return res.status(400).json({ error: "Tên sản phẩm đã tồn tại" });
      }
    }

    // Tạo dữ liệu cập nhật
    const updatedData = {
      productName: productName || existingProduct.productName,
      category: category || existingProduct.category,
      environment: environment || existingProduct.environment,
      color: color || existingProduct.color,
      description: description || existingProduct.description,
      originalPrice: originalPrice || existingProduct.originalPrice,
      discount: discount || existingProduct.discount,
      size: size || existingProduct.size,
      quantity: quantity !== undefined ? quantity : existingProduct.quantity,
      care: care || existingProduct.care,
      updatedAt: Date.now(),
    };

    // Cập nhật ảnh và video nếu có
    if (req.files.image && req.files.image.length > 0) {
      updatedData.image = req.files.image.map((file) => file.filename);
    } else {
      updatedData.image = existingProduct.image;
    }

    if (req.files.video && req.files.video.length > 0) {
      updatedData.video = req.files.video[0].filename;
    } else {
      updatedData.video = existingProduct.video;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category", "categoryName imageCategory descriptionCategory")
      .populate("environment", "nameEnviroment")
      .populate("color", "nameColor");

    const productsWithFinalPrice = products.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProductLowQuantity = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm có số lượng tồn kho dưới 5
    const products = await productModel
      .find({ quantity: { $lt: 5 } }) // Điều kiện lọc
      .populate("category", "categoryName imageCategory descriptionCategory")
      .populate("environment", "nameEnviroment")
      .populate("color", "nameColor");

    const productsWithFinalPrice = products.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy sản phẩm theo ID
const getProductByName = async (req, res) => {
  try {
    const { productName } = req.params; // Lấy tên sản phẩm từ URL

    const product = await productModel
      .findOne({ productName }) // Tìm sản phẩm bằng tên
      .populate("category", "categoryName imageCategory descriptionCategory")
      .populate("environment", "nameEnviroment")
      .populate("color", "nameColor");

    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
    }

    const finalPrice =
      product.originalPrice - (product.originalPrice * product.discount) / 100;

    const productWithFinalPrice = {
      ...product.toObject(),
      finalPrice,
    };

    res.status(200).json(productWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sản phẩm theo ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy sản phẩm theo ID danh mục
const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await productModel
      .find({ category: categoryId })
      .populate("category", "categoryName imageCategory descriptionCategory")
      .populate("environment", "nameEnviroment")
      .populate("color", "nameColor");

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy sản phẩm cho category này" });
    }

    const productsWithFinalPrice = products.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//Lấy các sản phẩm bán chạy
const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await productModel
      .find()
      .populate("category", "categoryName imageCategory descriptionCategory")
      .populate("environment", "nameEnviroment")
      .populate("color", "nameColor")
      .sort({ orderCount: -1 }) // Sắp xếp theo số lượng đơn hàng giảm dần
      .limit(10); // Lấy 5 sản phẩm bán chạy nhất

    // Chuyển đổi để bao gồm giá cuối
    const productsWithFinalPrice = topProducts.map((product) => ({
      ...product.toObject(),
      finalPrice: product.finalPrice, // Sử dụng phương thức ảo để tính giá cuối
    }));

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllProductsDiscount = async (req, res) => {
  try {
    const products = await productModel
      .find({ discount: { $gt: 0 } }) // Lọc các sản phẩm có discount > 0
      .sort({ discount: -1 }) // Sắp xếp theo % giảm giá giảm dần
      .populate("category", "categoryName imageCategory descriptionCategory")
      .populate("environment", "nameEnviroment")
      .populate("color", "nameColor");

    const productsWithFinalPrice = products.map((product) => {
      const finalPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;
      return {
        ...product.toObject(),
        finalPrice,
      };
    });

    res.status(200).json(productsWithFinalPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addProduct,
  updateProduct,
  getAllProducts,
  getProductByName,
  deleteProduct,
  getProductsByCategoryId,
  getTopSellingProducts,
  getAllProductsDiscount,
  getAllProductLowQuantity,
};
