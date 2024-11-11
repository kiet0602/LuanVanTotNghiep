import productModel from "../models/productModel.js";
import ImportModel from "../models/importModel.js";

export const createImport = async (req, res) => {
  try {
    const { supplier, items } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!supplier || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Thông tin phiếu nhập không hợp lệ." });
    }
    // Khởi tạo biến totalCost
    let totalCost = 0;
    // Cập nhật cost cho mỗi item và tính tổng cost
    for (let item of items) {
      const product = await productModel.findById(item.product);
      if (product) {
        // Tính toán cost cho sản phẩm này
        const priceToUse =
          product.discount > 0 ? product.finalPrice : product.originalPrice;
        const cost = Math.floor(priceToUse * item.quantity); // Làm tròn xuống
        item.cost = cost; // Gán giá trị cost cho từng sản phẩm trong items
        // Cộng dồn cost vào totalCost
        totalCost += cost;
        // Cập nhật số lượng sản phẩm trong cơ sở dữ liệu
        product.quantity = Number(product.quantity) + Number(item.quantity);
        // Lưu thay đổi vào cơ sở dữ liệu và đảm bảo không xảy ra lỗi do sử dụng giá trị cũ
        await product.save();
      } else {
        return res
          .status(404)
          .json({ message: `Không tìm thấy sản phẩm với ID: ${item.product}` });
      }
    }
    // Tạo phiếu nhập mới với totalCost và items đã cập nhật
    const newImport = new ImportModel({
      supplier,
      items,
      totalCost, // Gán totalCost vào phiếu nhập
    });

    // Kiểm tra thông tin phiếu nhập đã được tạo đúng chưa

    await newImport.save();

    res
      .status(201)
      .json({ message: "Phiếu nhập đã được thêm thành công!", newImport });
  } catch (error) {
    console.error("Lỗi khi thêm phiếu nhập:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thêm phiếu nhập." });
  }
};

export const updateImport = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier, items } = req.body;

    const importRecord = await ImportModel.findById(id);
    if (!importRecord) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập." });
    }

    // Hoàn trả số lượng kho trước khi cập nhật
    for (const item of importRecord.items) {
      const product = await productModel.findById(item.product);
      if (product) {
        // Giảm số lượng sản phẩm trong kho theo các item cũ trong phiếu nhập
        product.quantity -= item.quantity;
        await product.save();
      }
    }

    // Khởi tạo biến totalCost mới để tính tổng giá trị của phiếu nhập
    let totalCost = 0;

    // Cập nhật lại thông tin phiếu nhập và tính toán lại cost
    importRecord.supplier = supplier || importRecord.supplier;
    importRecord.items = items;

    // Tính toán lại cost cho mỗi item và cộng dồn vào totalCost
    for (let item of items) {
      const product = await productModel.findById(item.product);
      if (product) {
        const priceToUse =
          product.discount > 0 ? product.finalPrice : product.originalPrice;
        const cost = Math.floor(priceToUse * item.quantity); // Làm tròn xuống
        item.cost = cost; // Gán giá trị cost cho từng sản phẩm trong items
        totalCost += cost; // Cộng dồn cost vào totalCost

        // Cập nhật số lượng sản phẩm trong kho
        product.quantity = Number(product.quantity) + Number(item.quantity);
        await product.save();
      } else {
        return res
          .status(404)
          .json({ message: `Không tìm thấy sản phẩm với ID: ${item.product}` });
      }
    }

    // Cập nhật lại totalCost của phiếu nhập
    importRecord.totalCost = totalCost;

    // Lưu lại thông tin phiếu nhập đã cập nhật
    await importRecord.save();

    res.status(200).json({
      message: "Phiếu nhập đã được cập nhật thành công!",
      importRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật phiếu nhập." });
  }
};

export const deleteImport = async (req, res) => {
  try {
    const { id } = req.params;
    const importRecord = await ImportModel.findById(id);
    if (!importRecord) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập." });
    }

    // Khôi phục lại số lượng sản phẩm trước khi xóa phiếu nhập
    for (const item of importRecord.items) {
      const product = await productModel.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        await product.save();
      }
    }
    await ImportModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Phiếu nhập đã bị xóa thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xóa phiếu nhập." });
  }
};

export const getAllImports = async (req, res) => {
  try {
    // Lấy tất cả các phiếu nhập từ cơ sở dữ liệu
    const imports = await ImportModel.find()
      .populate("items.product") // Nếu muốn lấy thông tin chi tiết của sản phẩm, cần dùng populate
      .exec();

    // Kiểm tra xem có phiếu nhập nào không
    if (imports.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập." });
    }

    // Trả về danh sách phiếu nhập
    res.status(200).json(imports);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phiếu nhập:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách phiếu nhập." });
  }
};
