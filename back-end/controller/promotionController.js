import productModel from "../models/productModel.js";
import promotionModel from "../models/promotionModel.js";

import moment from "moment"; // Đảm bảo đã cài moment.js

const createPromotion = async (req, res) => {
  const { promotionName, description, startDate, endDate, productIds } =
    req.body;

  try {
    // Kiểm tra các sản phẩm có tồn tại không
    const products = await productModel.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Một số sản phẩm không tồn tại" });
    }

    // Chuyển đổi startDate và endDate thành định dạng Date hợp lệ
    const startDateObj = moment(startDate, "DD/MM/YYYY").toDate(); // Chuyển đổi từ chuỗi ngày tháng 'DD/MM/YYYY' thành đối tượng Date
    const endDateObj = moment(endDate, "DD/MM/YYYY").toDate();

    // Kiểm tra nếu ngày bắt đầu hoặc ngày kết thúc không hợp lệ
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res
        .status(400)
        .json({ message: "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ." });
    }

    // Tạo chương trình khuyến mãi mới
    const newPromotion = new promotionModel({
      promotionName,
      description,
      startDate: startDateObj,
      endDate: endDateObj,
      products: productIds,
    });

    const savedPromotion = await newPromotion.save();

    // Cập nhật các sản phẩm để tham gia chương trình khuyến mãi
    await productModel.updateMany(
      { _id: { $in: productIds } },
      { $set: { promotion: savedPromotion._id } }
    );

    res.status(201).json({
      message: "Chương trình khuyến mãi được tạo thành công",
      promotion: savedPromotion,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo chương trình khuyến mãi", error: err });
  }
};

export { createPromotion };
