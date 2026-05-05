router.post("/forgot-password", async (req, res) => {
  try {
    console.log("FORGOT PASSWORD REQUEST:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const kuEmailRegex = /^[a-zA-Z0-9._%+-]+@ku\.edu\.kw$/;

    if (!kuEmailRegex.test(email)) {
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

    console.log("OTP CREATED:", otp);
    console.log("ABOUT TO SEND EMAIL TO:", email);

    await sendEmail({
      to: email,
      subject: "University Bus System Password Reset OTP",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    return res.status(200).json({
      success: true,
      message: "OTP sent to your KU email.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP.",
    });
  }
});
