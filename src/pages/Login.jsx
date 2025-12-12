import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import axiosClient from "../api/axiosClient"; // adjust path if needed
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Make the login request. Change path if your API differs.
      const res = await axiosClient.post("/auth/login", { email, password });

      // expected response: { user: {...}, token: "..." }
      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Invalid response from server.");
      }

      // Save into context (this also writes to localStorage in your AuthProvider)
      login(user, token);

      // Redirect based on role
      if (user.role === "SYSTEM_ADMIN") navigate("/admin/dashboard");
      else if (user.role === "STORE_OWNER") navigate("/owner/dashboard");
      else navigate("/user/stores");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <div className="brand">
          <span className="brand-icon material-symbols-outlined">rocket_launch</span>
          <h2>Store Rater</h2>
        </div>
      </header>

      <main className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Log in to continue to Store Rater</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <p className="input-label">Email</p>
            <input
              type="email"
              placeholder="Enter your email address"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            <p className="input-label">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="forgot-line">
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup" className="link-primary">Sign Up</Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
