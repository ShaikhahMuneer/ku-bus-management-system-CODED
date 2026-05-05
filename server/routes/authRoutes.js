const express = require("express");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();
const express = require("express");
const {
  register,
  login,
  getMe,
  sendResetOtp,
  resetPasswordWithOtp,
} = require("../controllers/authController");

const { protect } = require("../middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

router.post("/forgot-password", sendResetOtp);
router.post("/reset-password", resetPasswordWithOtp);

module.exports = router;
