const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

const publicUserFields = "-password";

const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, universityId, gender, city, block } = req.body;
    const kuEmailRegex = /^[a-zA-Z0-9._]+@ku\.edu\.kw$/;

  if (!kuEmailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please register using your official KU email.",
    });
  }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists."
      });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role,
      universityId,
      gender,
      city,
      block
    });

    const token = createToken(user._id);
    const safeUser = await User.findById(user._id).select(publicUserFields);

    res.status(201).json({
      success: true,
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account is inactive."
      });
    }

    const token = createToken(user._id);
    const safeUser = await User.findById(user._id).select(publicUserFields);

    res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith("@ku.edu.kw")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid KU email.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "University Bus System Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.json({
      success: true,
      message: "OTP sent to your KU email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  sendResetOtp,
  resetPasswordWithOtp,
};
