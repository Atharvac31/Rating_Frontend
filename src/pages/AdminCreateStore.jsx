import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminCreateStore = () => {
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post("/admin/stores", {
        name: form.name,
        email: form.email,
        address: form.address,
        ownerId: form.ownerId || undefined, // adapt to your backend field name
      });
      alert("Store created");
      nav("/admin/stores"); // assume this route exists
    } catch (err) {
      alert(err.response?.data?.message || "Create store failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-root">
      <h1>Create Store</h1>
      <Link to="/admin/dashboard" className="btn">Admin</Link>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          <div className="label">Store Name</div>
          <input name="name" value={form.name} onChange={handleChange} className="admin-input" required />
        </label>

        <label>
          <div className="label">Email</div>
          <input name="email" value={form.email} onChange={handleChange} className="admin-input" />
        </label>

        <label>
          <div className="label">Address</div>
          <textarea name="address" value={form.address} onChange={handleChange} className="admin-input" />
        </label>

        <label>
          <div className="label">Owner (user id)</div>
          <input name="ownerId" value={form.ownerId} onChange={handleChange} className="admin-input" />
        </label>

        <button className="btn admin-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateStore;
