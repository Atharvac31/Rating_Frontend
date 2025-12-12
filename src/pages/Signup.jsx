import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import axiosClient from "../api/axiosClient"; // adjust path if needed

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // optional: basic frontend validation matching your backend rules
      if (form.name.length < 3) {
        throw new Error("Name must be at least 3 characters.");
      }

      await axiosClient.post("/auth/signup", form);

      // on success → go to login
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Signup failed. Please try again.";
      setError(msg);
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Sign up to start rating stores</p>

        {/* error message */}
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <p className="input-label">Full Name</p>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <p className="input-label">Email</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <p className="input-label">Address</p>
            <textarea
              name="address"
              placeholder="Enter your address"
              className="auth-input textarea"
              value={form.address}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <p className="input-label">Password</p>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="link-primary">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Signup;
