/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./admin.css";

const AdminUserDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user: authUser, token, login } = useAuth();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "NORMAL_USER" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/admin/users/${id}`);
        const data = res.data?.data ?? res.data ?? res.data?.user ?? res.data;
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "NORMAL_USER",
        });
      } catch (err) {
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Decide endpoint and payload:
      // If editing current user -> call /users/me (no role)
      // Else -> call admin endpoint /admin/users/:id (include role)
      const isEditingSelf =
        id === "me" || (authUser && Number(id) === Number(authUser.id));

      if (isEditingSelf) {
        // build payload without role
        const payload = {
          name: form.name,
          email: form.email,
        };

        const res = await axiosClient.put(`/users/me`, payload);

        // server returns updated user (try multiple shapes)
        const updated = res.data?.user ?? res.data?.data ?? res.data;

        // update auth context so app reflects changes
        if (updated) {
          // keep existing token
          login(updated, token);
        }

        alert("Saved");
        nav("/profile"); // redirect to profile or users list as desired
      } else {
        // admin editing another user -> correct admin endpoint
        const res = await axiosClient.put(`/admin/users/${id}`, form);
        // optionally inspect res for updated user
        alert("Saved");
        nav("/admin/users");
      }
    } catch (err) {
      console.error("Save error", err);
      setError(err.response?.data?.message || "Save failed");
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    // prevent deleting yourself from the UI as an extra safety
    const isEditingSelf =
      id === "me" || (authUser && Number(id) === Number(authUser.id));
    if (isEditingSelf) {
      alert("You cannot delete your own account from here.");
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await axiosClient.delete(`/admin/users/${id}`);
      alert("User deleted");
      nav("/admin/users");
    } catch (err) {
      console.error("Delete error", err);
      setError(err.response?.data?.message || "Delete failed");
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>No user found</div>;

  const isEditingSelf = id === "me" || (authUser && Number(id) === Number(authUser.id));

  return (
    <div className="admin-root">
      <h1>{isEditingSelf ? "Edit Your Profile" : "Edit User"}</h1>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSave}>
        <label>
          <div className="label">Name</div>
          <input name="name" value={form.name} onChange={handleChange} className="admin-input" />
        </label>

        <label>
          <div className="label">Email</div>
          <input name="email" value={form.email} onChange={handleChange} className="admin-input" />
        </label>

        {/* Only show role when admin editing other users */}
        {!isEditingSelf && (
          <label>
            <div className="label">Role</div>
            <select name="role" value={form.role} onChange={handleChange} className="admin-input">
              <option value="NORMAL_USER">User</option>
              <option value="STORE_OWNER">Owner</option>
              <option value="SYSTEM_ADMIN">Admin</option>
            </select>
          </label>
        )}

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
          <button className="btn admin-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>

          {/* Show delete button only when editing others */}
          {!isEditingSelf && (
            <button
              type="button"
              className="btn"
              style={{ background: "#ef4444" }}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete User"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminUserDetails;
