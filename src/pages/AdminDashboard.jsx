/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import "./admin.css";
import { useNavigate } from "react-router-dom";
const StatCard = ({ title, value, linkTo, linkText = "View" }) => (
  <div className="admin-card">
    <div className="admin-card-title">{title}</div>
    <div className="admin-card-value">{value}</div>
    {linkTo && (
      <div style={{ marginTop: 10 }}>
        <Link to={linkTo} className="link" style={{ fontWeight: 600 }}>
          {linkText}
        </Link>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();
    // const { user, token, logout } = useAuth();
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosClient.get("/admin/dashboard");
        const d = res.data || {};
        setStats({
          totalUsers: d.totalUsers ?? d.total_users ?? d.total_users_count ?? d.totalUsersCount ?? d.users ?? 0,
          totalStores: d.totalStores ?? d.total_stores ?? d.stores ?? 0,
          totalRatings: d.totalRatings ?? d.total_ratings ?? d.ratings ?? 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-root">
      <h1 className="admin-title">Admin Dashboard</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="admin-grid">
            <StatCard title="Total Users" value={stats.totalUsers} linkTo="/admin/users" linkText="View users" />
            <StatCard title="Total Stores" value={stats.totalStores} linkTo="/stores" linkText="View stores" />
            <StatCard title="Total Ratings" value={stats.totalRatings} linkTo="/stores" linkText="View ratings" />
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Quick actions</h3>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/admin/users" className="btn">Manage Users</Link>
              <Link to="/stores" className="btn">Manage Stores</Link>
              <Link to="/admin/stores/create" className="btn">Create Store</Link>
                                <button
          className="btn"
          style={{ background: "#ef4444", padding: "6px 14px",margin:"10px" }}
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Logout
        </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
