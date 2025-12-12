/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import "./admin.css";

const AdminStoreEdit = () => {
  const { id } = useParams(); // undefined when route is /admin/stores/create
  const isCreate = !id || id === "create";
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [owners, setOwners] = useState([]); // store owners for dropdown
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOwners();
    if (!isCreate) fetchStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOwners = async () => {
    try {
      // fetch admin users filtered by role STORE_OWNER
      const res = await axiosClient.get("/admin/users", { params: { role: "STORE_OWNER", limit: 100 } });
      const list = res.data?.data ?? [];
      setOwners(list);
    } catch (err) {
      console.error("Failed to fetch owners", err);
      // continue — owner select will be empty
    }
  };

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/stores/${id}`);

      // your backend returns: { message, store: { ... } }
      const s = res.data?.store ?? res.data?.data ?? res.data ?? {};

      setForm({
        name: s.name || "",
        email: s.email || "",
        address: s.address || "",
        // backend uses owner_id; prefer that, fall back to nested owner
        ownerId: s.owner_id ?? s.owner?.id ?? "",
      });
    } catch (err) {
      console.error("Failed to fetch store", err);
      setError("Failed to load store");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        email: form.email || null,
        address: form.address,
        ownerId: form.ownerId || undefined,
      };

      if (isCreate) {
        await axiosClient.post("/admin/stores", payload);
        alert("Store created");
      } else {
        await axiosClient.put(`/admin/stores/${id}`, payload);
        alert("Store updated");
      }

      nav("/admin/stores");
    } catch (err) {
      console.error("Save error", err);
      setError(err.response?.data?.message || "Save failed");
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-root">
      <h1>{isCreate ? "Create Store" : "Edit Store"}</h1>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSave}>
        <label>
          <div className="label">Store Name</div>
          <input name="name" value={form.name} onChange={handleChange} className="admin-input" required />
        </label>

        <label>
          <div className="label">Email (optional)</div>
          <input name="email" value={form.email} onChange={handleChange} className="admin-input" />
        </label>

        <label>
          <div className="label">Address</div>
          <textarea name="address" value={form.address} onChange={handleChange} className="admin-input" rows={3} />
        </label>

        <label>
          <div className="label">Owner (store owner user)</div>
          <select name="ownerId" value={form.ownerId} onChange={handleChange} className="admin-input">
            <option value="">-- Select owner (optional) --</option>
            {owners.map((o) => (
              <option value={o.id} key={o.id}>
                {o.name} — {o.email}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button className="btn admin-btn" type="submit" disabled={saving}>
            {saving ? (isCreate ? "Creating..." : "Saving...") : isCreate ? "Create" : "Save"}
          </button>

          <button type="button" className="btn" onClick={() => nav("/admin/stores")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminStoreEdit;
