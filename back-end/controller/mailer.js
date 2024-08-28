import nodemailer from "nodemailer";
import Mailgen from "mailgen"; // Import Mailgen từ gói mailgen

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "darwin.beier@ethereal.email",
    pass: "4xrDa8qATjPZn2YMJC",
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
