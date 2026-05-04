import React, { useState } from "react";

function SignUpPage({ setPage, handleSignUp, isLoading }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
    alert("Please fill all required fields.");
    return;
  }

  if (!formData.email.endsWith("@ku.edu.kw")) {
    alert("Please use your official Kuwait University email.");
    return;
  }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    handleSignUp(formData);
  };

  return (
    <div className="auth-screen">
      <form className="auth-card auth-card-large" onSubmit={handleSubmit}>
        <div className="bus-logo">🚌</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the University Bus System</p>

        <label>Full Name</label>
        <input className="input" name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />

        <label>University Email</label>
        <input className="input" name="email" type="email" placeholder="s2231172129@ku.edu.kw/name@ku.edu.kw" value={formData.email} onChange={handleChange} />

        <label>Phone Number</label>
        <input className="input" name="phone" type="text" placeholder="+96550123456" value={formData.phone} onChange={handleChange} />

        <label>Password</label>
        <input className="input" name="password" type="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} />

        <label>Confirm Password</label>
        <input className="input" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />

        <label>Role</label>
        <select className="input" name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>

        <button className="main-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="bottom-text">
          Already have an account? <span onClick={() => setPage("login")}>Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;
