import productModel from "../models/productModel.js";
import ImportModel from "../models/importModel.js";
import moment from "moment-timezone";

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
    let totalCost = 0; // Đảm bảo totalCost bắt đầu từ 0
    console.log("Khởi tạo totalCost:", totalCost);

    // Cập nhật cost cho mỗi item và tính tổng cost
    for (let item of items) {
      // Log các item nhận được từ request để kiểm tra
      console.log("Processing item:", item);

      const product = await productModel.findById(item.product);
      if (!product) {
        console.log(`Không tìm thấy sản phẩm với ID: ${item.product}`);
        return res
          .status(404)
          .json({ message: `Không tìm thấy sản phẩm với ID: ${item.product}` });
      }

      console.log("Sản phẩm tìm thấy:", product);

      if (!item.price || item.price <= 0) {
        console.log(
          `Giá nhập không hợp lệ cho sản phẩm: ${item.product}, giá nhập: ${item.price}`
        );
        return res.status(400).json({
          message: `Giá nhập không hợp lệ cho sản phẩm với ID: ${item.product}`,
        });
      }

      // Tính toán cost (làm tròn xuống nếu cần)
      const price = Math.floor(Number(item.price));
      const quantity = Math.floor(Number(item.quantity));
      const cost = price * quantity; // Tính cost

      // Log chi phí tính được
      console.log(
        `Giá sản phẩm: ${price}, Số lượng: ${quantity}, Tổng chi phí: ${cost}`
      );

      // Cập nhật cost cho item
      item.cost = cost;

      // Cộng dồn cost vào totalCost
      totalCost += cost;

      // Log tổng chi phí sau khi cộng dồn
      console.log("Tổng chi phí sau khi cộng dồn:", totalCost);

      // Cập nhật số lượng sản phẩm trong cơ sở dữ liệu
      product.quantity = Number(product.quantity) + quantity;
      console.log(`Số lượng sản phẩm sau khi cập nhật: ${product.quantity}`);

      await product.save();
    }

    // Log dữ liệu cuối cùng của phiếu nhập
    console.log("Dữ liệu phiếu nhập:", {
      supplier,
      items,
      totalCost,
    });
    // const importCreatedAt = moment()
    //   .tz("Asia/Ho_Chi_Minh")
    //   .add(7, "hours")
    //   .toDate();
    // Tạo phiếu nhập mới với totalCost và items đã cập nhật
    const newImport = new ImportModel({
      supplier,
      items,
      totalCost,
      // createdAt: importCreatedAt, // Sử dụng totalCost đúng
    });
    // Kiểm tra lại giá trị totalCost trước khi lưu
    console.log("Giá trị totalCost khi lưu:", totalCost);
    await newImport.save();
    console.log("Phiếu nhập mới đã được lưu:", newImport);

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
export const getTotalImportCost = async (req, res) => {
  try {
    // Lấy tất cả các phiếu nhập từ cơ sở dữ liệu
    const imports = await ImportModel.find().exec();

    // Kiểm tra xem có phiếu nhập nào không
    if (imports.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập." });
    }

    // Tính tổng nhập (total cost) từ tất cả phiếu nhập
    const totalImportCost = imports.reduce((total, importDoc) => {
      return total + importDoc.totalCost;
    }, 0);

    // Trả về tổng nhập
    res.status(200).json({
      message: "Tính tổng nhập thành công.",
      totalImportCost,
    });
  } catch (error) {
    console.error("Lỗi khi tính tổng nhập:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi tính tổng nhập." });
  }
};
