/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./stores.css";

const AdminStoreCard = ({ store, onEdit, onDelete }) => {
  return (
    <div className="store-card">
      <div className="store-left">
        <h3 className="store-name">{store.name}</h3>
        <p className="store-address">{store.address}</p>

        <div className="meta-row">
          <span className="avg-label">Avg Rating:</span>
          <span className="avg-value">
            {store.avgRating != null ? store.avgRating.toFixed(1) : "—"}
          </span>
          <span className="dot">•</span>
          <span className="count">{store.totalRatings ?? 0} ratings</span>
        </div>

        <div className="meta-row">
          <strong>Owner:</strong>{" "}
          {store.owner ? `${store.owner.name} (${store.owner.email})` : "No owner"}
        </div>
      </div>

      <div className="store-right" style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={() => onEdit(store.id)}>Edit</button>
        <button
          className="btn"
          style={{ background: "#d9534f" }}
          onClick={() => onDelete(store.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const AdminStoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(`/admin/stores`, { params: { page, search } });
      const raw = res.data?.data ?? [];
      const mapped = raw.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        avgRating: s.average_rating ? parseFloat(s.average_rating) : null,
        totalRatings: s.ratings_count ?? 0,
        owner: s.owner ?? null,
      }));
      setStores(mapped);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStores();
  };

  const handleEdit = (storeId) => {
    nav(`/admin/stores/${storeId}`);
  };

  const handleCreate = () => {
    nav("/admin/stores/create");
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm("Delete this store? This action cannot be undone.")) return;
    try {
      await axiosClient.delete(`/admin/stores/${storeId}`);
      alert("Store deleted");
      fetchStores();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="stores-root">
      <div className="stores-header" style={{ alignItems: "center" }}>
        <h2>Manage Stores</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="search"
              placeholder="Search by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="btn" type="submit">Search</button>
          </form> */}
          <Link to="/admin/dashboard" className="btn">Admin</Link>
          <button className="btn" onClick={handleCreate}>Create Store</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty">No stores found.</div>
      ) : (
        <div className="stores-list">
          {stores.map((store) => (
            <div key={store.id} className="store-row">
              <AdminStoreCard store={store} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="page-indicator">Page {page}</span>
        <button className="page-btn" onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminStoreList;
