import nodemailer from "nodemailer";
import Mailgen from "mailgen"; // Import Mailgen từ gói mailgen
import userModel from "../models/userModel.js";
import couponModel from "../models/couponModel.js";

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "albert42@ethereal.email",
    pass: "cz16tqdxDH6wEN7Xu4",
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

// Đổi tên biến Mailgen để tránh xung đột
let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  const { userEmail, text, subject } = req.body;

  // body of the email
  var email = {
    body: {
      intro:
        text ||
        "Welcome to Daily Tuition! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = mailGenerator.generate(email); // Sử dụng mailGenerator thay vì MailGenerator

  let message = {
    from: process.env.USERNAME_EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  // send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us." });
    })
    .catch((error) => res.status(500).send({ error }));
};

export const sendVoucherEmail = async (req, res) => {
  const { userId, couponId } = req.body;

  try {
    // Tìm voucher
    const coupon = await couponModel.findById(couponId);
    if (!coupon) {
      return res.status(404).send({ error: "Coupon not found" });
    }

    // Tìm người dùng
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Kiểm tra xem voucher đã được gửi cho người dùng chưa
    if (coupon.usedBy.length > 0) {
      return res
        .status(400)
        .send({ error: "Voucher has already been sent to another user" });
    }

    // Kiểm tra xem voucher còn hạn sử dụng không
    const now = new Date();
    if (now < coupon.startDate || now > coupon.expirationDate) {
      return res.status(400).send({ error: "Voucher is not valid" });
    }

    // Cập nhật voucher để thêm người dùng vào danh sách đã nhận
    coupon.usedBy.push(userId);
    await coupon.save();

    // Tạo nội dung email
    const email = {
      body: {
        intro: `Congratulations! You have received a voucher code from us.`,
        table: {
          data: [
            { item: "Voucher Code", description: coupon.code },
            { item: "Discount", description: `${coupon.discountPercentage}%` },
            {
              item: "Expiry Date",
              description: coupon.expirationDate.toDateString(),
            },
          ],
        },
        outro: `Use this voucher code at checkout to enjoy your discount!`,
      },
    };

    const emailBody = mailGenerator.generate(email);

    let message = {
      from: process.env.USERNAME_EMAIL,
      to: user.email,
      subject: "Your Voucher Code",
      html: emailBody,
    };

    // Gửi email
    await transporter.sendMail(message);
    res.status(200).send({ msg: "Voucher email sent successfully." });
  } catch (error) {
    console.error("Error sending voucher email:", error);
    res.status(500).send({ error: "Failed to send voucher email" });
  }
};
