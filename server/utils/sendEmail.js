const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM || "University Bus System"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("OTP email could not be sent. Check EMAIL_USER and EMAIL_PASS.");
  }
};

module.exports = sendEmail;