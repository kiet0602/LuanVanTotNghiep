import ClassificationModel from "../models/Classification.js"; // Adjust the path as needed

// Tạo một phân loại mới
export const createClassification = async (req, res) => {
  try {
    const { classificationName } = req.body;

    // Loại bỏ khoảng trắng dư thừa ở đầu và cuối, đồng thời tạo regex để kiểm tra không phân biệt hoa thường và khoảng trắng
    const formattedClassificationName = classificationName
      .trim()
      .replace(/\s+/g, " ") // Loại bỏ khoảng trắng dư thừa
      .toLowerCase(); // Chuyển đổi thành chữ thường để so sánh không phân biệt hoa thường

    // Sử dụng regex để tìm tên phân loại không phân biệt hoa thường và khoảng trắng
    const existingClassification = await ClassificationModel.findOne({
      classificationName: {
        $regex: `^${formattedClassificationName}$`, // Sử dụng regex với tên chuẩn hóa
        $options: "i", // Đảm bảo so sánh không phân biệt hoa thường
      },
    });

    if (existingClassification) {
      return res.status(400).json({ message: "Tên phân loại đã tồn tại." });
    }

    // Tạo phân loại mới với tên đã được định dạng
    const newClassification = new ClassificationModel({
      classificationName: formattedClassificationName,
    });
    await newClassification.save();

    res.status(201).json(newClassification);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo phân loại", error });
  }
};

// Lấy tất cả phân loại
export const getClassifications = async (req, res) => {
  try {
    const classifications = await ClassificationModel.find();
    res.status(200).json(classifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phân loại", error });
  }
};

// Lấy phân loại theo ID
export const getClassificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const classification = await ClassificationModel.findById(id);
    if (!classification) {
      return res.status(404).json({ message: "Phân loại không tìm thấy" });
    }
    res.status(200).json(classification);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy phân loại", error });
  }
};

// Cập nhật phân loại theo ID
export const updateClassification = async (req, res) => {
  try {
    const { id } = req.params;
    const { classificationName } = req.body;

    // Chuẩn hóa tên phân loại bằng cách loại bỏ khoảng trắng thừa
    const formattedClassificationName = classificationName
      .trim()
      .replace(/\s+/g, " ");

    // Kiểm tra xem tên phân loại đã tồn tại không phân biệt hoa thường và khoảng trắng
    const existingClassification = await ClassificationModel.findOne({
      classificationName: {
        $regex: `^${formattedClassificationName}$`,
        $options: "i",
      },
    });

    if (existingClassification) {
      return res.status(400).json({ message: "Tên phân loại đã tồn tại" });
    }

    // Cập nhật tên phân loại
    const updatedClassification = await ClassificationModel.findByIdAndUpdate(
      id,
      {
        classificationName: formattedClassificationName,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedClassification) {
      return res.status(404).json({ message: "Phân loại không tìm thấy" });
    }

    res.status(200).json(updatedClassification);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật phân loại", error });
  }
};

// Xóa phân loại theo ID
export const deleteClassification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClassification = await ClassificationModel.findByIdAndDelete(
      id
    );
    if (!deletedClassification) {
      return res.status(404).json({ message: "Phân loại không tìm thấy" });
    }
    res.status(200).json({ message: "Xóa phân loại thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa phân loại", error });
  }
};
