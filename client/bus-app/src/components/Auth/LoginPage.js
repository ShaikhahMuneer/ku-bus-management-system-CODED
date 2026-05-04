import React from "react";

function LoginPage({
  setPage,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loginError,
  isLoading
}) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="bus-logo">🚌</div>
        <h1 className="auth-title">University Bus</h1>
        <p className="auth-subtitle">Transportation Management System</p>

        <label>University Email</label>
        <input
          className="input"
          type="email"
          placeholder="your.email@university.edu"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter your password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />

        <button className="main-btn" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {loginError && <p className="error-text">{loginError}</p>}

        <p className="link-line" onClick={() => setPage("forgot")}>
          Forgot Password?
        </p>

        <p className="bottom-text">
          Don’t have an account?{" "}
          <span onClick={() => setPage("signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;