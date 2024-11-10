// controllers/contactController.js
import ContactModel from "../models/contactModel.js";

// Hàm để gửi liên hệ
export const createContact = async (req, res) => {
  const { name, email, message, title } = req.body;

  try {
    const newContact = new ContactModel({ name, email, message, title });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Liên hệ của bạn đã được gửi thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi gửi liên hệ. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
};

// Hàm để lấy tất cả liên hệ
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách liên hệ.",
      error: error.message,
    });
  }
};
