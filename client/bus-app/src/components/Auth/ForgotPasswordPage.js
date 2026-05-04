import React, { useState } from "react";
import { authApi } from "../../services/api";

function ForgotPasswordPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email || !email.endsWith("@ku.edu.kw")) {
      alert("Please enter a valid KU email.");
      return;
    }

    try {
      setIsLoading(true);
      await authApi.forgotPassword(email);
      setOtpSent(true);
      alert("OTP sent to your KU email.");
    } catch (error) {
      alert(error.message || "Could not send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      alert("Please enter OTP and new password.");
      return;
    }

    try {
      setIsLoading(true);

      await authApi.resetPassword({
        email,
        otp,
        newPassword,
      });

      alert("Password reset successfully.");
      setPage("login");
    } catch (error) {
      alert(error.message || "Could not reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card forgot-card">
        <p className="back-link" onClick={() => setPage("login")}>
          ← Back to Login
        </p>

        <h1 className="forgot-title">Reset Password</h1>

        <p className="forgot-subtitle">
          Enter your KU email to receive an OTP
        </p>

        <label>KU Email</label>
        <input
          className="input"
          type="email"
          placeholder="s2231172129@ku.edu.kw or name@ku.edu.kw"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
        />

        {!otpSent ? (
          <button className="main-btn" onClick={handleSendOtp} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <label>OTP</label>
            <input
              className="input"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <label>New Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              className="main-btn"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
