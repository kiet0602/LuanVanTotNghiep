import ClassificationModel from "../models/Classification.js"; // Adjust the path as needed

// Tạo một phân loại mới
export const createClassification = async (req, res) => {
  try {
    const { classificationName } = req.body;
    const newClassification = new ClassificationModel({ classificationName });
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
    const updatedClassification = await ClassificationModel.findByIdAndUpdate(
      id,
      { classificationName, updatedAt: Date.now() },
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
