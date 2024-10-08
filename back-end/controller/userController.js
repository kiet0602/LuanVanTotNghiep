import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import validator from "validator";

const verifyUser = async (req, res, next) => {
  const { email } = req.method === "GET" ? req.query : req.body;
  try {
    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await userModel.findOne({ email });

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      return res.status(404).send({ error: "Can't find User!" });
    }
    // Người dùng tồn tại, tiếp tục xử lý tiếp theo
    next();
  } catch (error) {
    // Xử lý lỗi nếu có lỗi xảy ra trong quá trình tìm kiếm
    return res.status(500).send({ error: "Chưa xác thực được người dùng" });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, avatar, numberPhone } = req.body;

    // Kiểm tra email tồn tại
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ error: "Email này đã tồn tại" });
    }

    // Kiểm tra numberPhone có hợp lệ không
    if (!numberPhone) {
      return res.status(400).send({ error: "Số điện thoại là bắt buộc" });
    }

    if (!validator.isMobilePhone(numberPhone, "vi-VN")) {
      return res.status(400).send({ error: "Số điện thoại không hợp lệ" });
    }

    const existNumberPhone = await userModel.findOne({ numberPhone });
    if (existNumberPhone) {
      return res
        .status(400)
        .send({ error: "Số điện thoại này đã có người đăng kí" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "",
      numberPhone,
    });

    // Lưu user và trả về kết quả
    const result = await user.save();
    return res.status(201).send({ msg: "Đăng kí thành công", user: result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "Không tìm thấy người dùng" });
    }

    // Kiểm tra mật khẩu
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ error: "Mật khẩu sai" });
    }

    // Tạo token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Gửi phản hồi thành công
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: null, // Ẩn mật khẩu
      ward: user.ward || "",
      district: user.district || "",
      city: user.city || "",
      avatar: user.avatar || "",
      numberPhone: user.numberPhone,
      role: user.role,
      token,
    });
  } catch (error) {
    return res.status(500).send({ error: "Lỗi đăng nhập" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).send({ error: "Chưa nhập id người dùng vào" });
    }
    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).send({ error: "Không tìm thấy người dùng" });
    }
    const { password, ...rest } = user.toObject();
    return res.status(200).send(rest);
  } catch (error) {
    res.json("Lỗi lấy người dùng");
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Tìm tất cả người dùng trong cơ sở dữ liệu
    const users = await userModel.find();

    // Loại bỏ mật khẩu khỏi các thông tin người dùng trước khi gửi phản hồi
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });

    // Trả về danh sách người dùng mà không có mật khẩu
    return res.status(200).json(usersWithoutPassword);
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    return res.status(500).json({ error: "Lỗi lấy danh sách người dùng" });
  }
};

const updateUser = async (req, res) => {
  const { username, email, numberPhone, ward, district, city } = req.body;

  try {
    const { userId } = req.user;

    if (!userId) {
      return res
        .status(401)
        .send({ error: "Lỗi chưa xác định được người dùng!" });
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).send({ error: "Không tìm thấy được người dùng!" });
    }

    if (email && email !== existingUser.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(400).send({ error: "Email này đã được sử dụng." });
      }
    }

    if (numberPhone && numberPhone !== existingUser.numberPhone) {
      if (!validator.isMobilePhone(numberPhone, "vi-VN")) {
        return res.status(400).send({ error: "Số điện thoại không hợp lệ" });
      }

      const numberPhoneExists = await userModel.findOne({ numberPhone });
      if (numberPhoneExists) {
        return res
          .status(400)
          .send({ error: "Số điện thoại này đã được sử dụng." });
      }
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (numberPhone) updateFields.numberPhone = numberPhone;
    if (ward) updateFields.ward = ward;
    if (district) updateFields.district = district;
    if (city) updateFields.city = city;

    if (req.file) {
      updateFields.avatar = req.file.filename;
    }

    await userModel.updateOne({ _id: userId }, { $set: updateFields });

    const updatedUser = await userModel.findById(userId);
    return res.status(200).send({ updatedUser });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const generateOTP = async (req, res) => {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(200).send({ code: req.app.locals.OTP });
};

const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify successful" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "access granted" });
  }
  return res.status(440).send({ error: "Session expired" });
};

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.updateOne(
      { email: user.email },
      { password: hashedPassword }
    );
    req.app.locals.resetSession = false; // Reset session

    return res.status(201).send({ msg: "Record updated!" });
  } catch (error) {
    if (error.message.includes("hashed")) {
      return res.status(500).send({ error: "Unable to hash password" });
    }
    return res.status(500).send({ error });
  }
};

const authenticate = (req, res) => {
  res.end();
};

export {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  authenticate,
  verifyUser,
  getAllUsers,
};
