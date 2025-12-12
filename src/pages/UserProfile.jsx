import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import "./auth.css"; // reuse auth styles (or admin.css)

const UserProfile = () => {
  const { user, token, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
//   const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    // Initialize form from context user
    setForm((f) => ({
      ...f,
      name: user.name ?? "",
      email: user.email ?? "",
      address: user.address ?? "",
    }));
  }, [user]);

  // Optional: fetch fresh user from backend if you want
  // useEffect(() => {
  //   if (!user?.id) return;
  //   (async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axiosClient.get(`/users/${user.id}`);
  //       const fresh = res.data?.data ?? res.data;
  //       setForm({ name: fresh.name, email: fresh.email, address: fresh.address, password: "" });
  //     } catch (err) {
  //       console.warn("Could not fetch fresh profile", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, [user]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user?.id) return setError("User not found.");

    // basic validation
    if (!form.name.trim() || !form.email.trim()) {
      return setError("Name and email are required.");
    }

    setSaving(true);
    try {
      // choose PUT or PATCH depending on your API
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address?.trim() || undefined,
      };
      if (form.password && form.password.length > 0) payload.password = form.password;

      const res = await axiosClient.put(`/user/me`, payload);
      const updated = res.data?.data ?? res.data ?? res.data?.user ?? updated;

      // update auth context (preserve token)
      login(updated, token);

      setSuccess("Profile updated successfully.");
      setForm((p) => ({ ...p, password: "" }));
    } catch (err) {
      console.error("Profile update error", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-container">
      <main className="auth-card" style={{ maxWidth: 720 }}>
        <h1 className="auth-title">Your Profile</h1>
        {error && <div className="auth-error">{error}</div>}
        {success && <div style={{ color: "green", marginBottom: 12 }}>{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <p className="input-label">Full Name</p>
            <input name="name" value={form.name} onChange={handleChange} className="auth-input" required />
          </label>

          <label>
            <p className="input-label">Email</p>
            <input name="email" value={form.email} onChange={handleChange} className="auth-input" type="email" required />
          </label>

          <label>
            <p className="input-label">Address</p>
            <textarea name="address" value={form.address} onChange={handleChange} className="auth-input textarea" />
          </label>

          <label>
            <p className="input-label">New Password (leave blank to keep current)</p>
            <input name="password" value={form.password} onChange={handleChange} className="auth-input" type="password" />
          </label>

          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default UserProfile;
