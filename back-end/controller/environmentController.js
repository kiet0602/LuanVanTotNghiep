// environmentController.js
import EnvironmentModel from "../models/environmentModel.js"; // Đường dẫn đúng tới file model

// GET all environments
export const getAllEnvironments = async (req, res) => {
  try {
    const environments = await EnvironmentModel.find();
    res.status(200).json(environments);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve environments", error });
  }
};

// GET environment by ID
export const getEnvironmentById = async (req, res) => {
  try {
    const environment = await EnvironmentModel.findById(req.params.id);
    if (!environment) {
      return res.status(404).json({ message: "Environment not found" });
    }
    res.status(200).json(environment);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve environment", error });
  }
};

// POST create new environment
export const createEnvironment = async (req, res) => {
  try {
    const { nameEnviroment } = req.body;

    // Loại bỏ khoảng trắng dư thừa và chuẩn hóa khoảng trắng
    const formattedEnvironmentName = nameEnviroment.trim().replace(/\s+/g, " ");

    // Sử dụng regex để kiểm tra không phân biệt hoa thường và khoảng trắng
    const existingEnvironment = await EnvironmentModel.findOne({
      nameEnviroment: {
        $regex: `^${formattedEnvironmentName}$`,
        $options: "i",
      },
    });

    if (existingEnvironment) {
      return res.status(400).json({ message: "Môi trường sống đã tồn tại" });
    }

    // Tạo môi trường mới với tên đã được định dạng
    const newEnvironment = new EnvironmentModel({
      ...req.body,
      nameEnviroment: formattedEnvironmentName,
    });

    const savedEnvironment = await newEnvironment.save();
    res.status(201).json(savedEnvironment);
  } catch (error) {
    res.status(400).json({ message: "Failed to create environment", error });
  }
};

// PUT update environment by ID
export const updateEnvironmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameEnviroment, ...otherFields } = req.body;

    // Kiểm tra nếu có tên mới và tên đó đã tồn tại trong tài liệu khác
    if (nameEnviroment) {
      const existingEnvironment = await EnvironmentModel.findOne({
        nameEnviroment,
        _id: { $ne: id },
      });
      if (existingEnvironment) {
        return res
          .status(400)
          .json({ message: "Environment name already exists" });
      }
    }

    // Lấy tài liệu hiện tại
    const existingEnvironment = await EnvironmentModel.findById(id);
    if (!existingEnvironment) {
      return res.status(404).json({ message: "Environment not found" });
    }

    // Cập nhật các trường, giữ nguyên giá trị cũ nếu không có giá trị mới
    const updatedData = {
      nameEnviroment: nameEnviroment || existingEnvironment.nameEnviroment,
      ...otherFields,
    };

    // Cập nhật tài liệu
    const updatedEnvironment = await EnvironmentModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedEnvironment);
  } catch (error) {
    res.status(400).json({ message: "Failed to update environment", error });
  }
};

// DELETE environment by ID
export const deleteEnvironmentById = async (req, res) => {
  try {
    const deletedEnvironment = await EnvironmentModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedEnvironment) {
      return res.status(404).json({ message: "Environment not found" });
    }
    res.status(200).json({ message: "Environment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete environment", error });
  }
};
