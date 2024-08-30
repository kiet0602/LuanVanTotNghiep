import characteristicModel from "../models/characteristicModel.js";

const addCharacteristic = async (req, res) => {
  try {
    const { characteristicName } = req.body;
    if (!characteristicName) {
      return res
        .status(400)
        .json({ message: "Tên của characteristicName là bắt buộc!" });
    }
    // Kiểm tra xem characteristic đã tồn tại chưa
    const existingCharacteristic = await characteristicModel.findOne({
      characteristicName,
    });
    if (existingCharacteristic) {
      return res.status(400).json({ message: "Đặt điểm này đã tồn tại rồi." });
    }
    const newCharacteristic = new characteristicModel({ characteristicName });
    await newCharacteristic.save();
    res.status(201).json(newCharacteristic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCharacteristicId = async (req, res) => {
  try {
    const characteristic = await characteristicModel.findById(req.params.id);
    if (!characteristic) {
      return res.status(404).json({ message: "Characteristic not found." });
    }
    res.status(200).json(characteristic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCharacteristic = async (req, res) => {
  try {
    const { characteristicName } = req.body;
    const updatedCharacteristic = await characteristicModel.findByIdAndUpdate(
      req.params.id,
      { characteristicName },
      { new: true, runValidators: true }
    );
    if (!updatedCharacteristic) {
      return res.status(404).json({ message: "Characteristic not found." });
    }
    res.status(200).json(updatedCharacteristic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCharacteristic = async (req, res) => {
  try {
    const characteristics = await characteristicModel.find();
    res.status(200).json(characteristics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteCharacteristic = async (req, res) => {
  try {
    const characteristic = await characteristicModel.findByIdAndDelete(
      req.params.id
    );
    if (!characteristic) {
      return res.status(404).json({ message: "Characteristic not found." });
    }
    res.status(200).json({ message: "Characteristic deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addCharacteristic,
  getCharacteristicId,
  updateCharacteristic,
  getAllCharacteristic,
  deleteCharacteristic,
};
