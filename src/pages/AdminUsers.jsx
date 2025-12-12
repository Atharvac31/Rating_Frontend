/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import "./admin.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { user, token, logout } = useAuth();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/admin/users");
      // backend might return array or { data: [...] }
      const raw = res.data?.data ?? res.data ?? [];
      setUsers(raw);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id) => {
  //   if (!confirm("Are you sure you want to delete this user?")) return;
  //   try {
  //     await axiosClient.delete(`/admin/users/${id}`);
  //     setUsers((u) => u.filter((x) => x.id !== id));
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Delete failed");
  //   }
  // };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (u.name || "").toLowerCase().includes(s) || (u.email || "").toLowerCase().includes(s);
  });

  return (
    <div className="admin-root">
      <div className="admin-list-header">
        <h1>Users</h1>
        <div>
          {/* <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
          /> */}
          <Link to="/admin/dashboard" className="btn">Admin</Link>
          <Link to="/admin/users/create" className="btn admin-btn">Create User</Link>
                  <button
          className="btn"
          style={{ background: "#ef4444", padding: "10px 14px",margin:"10px" }}
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Logout
        </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5">No users</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><Link to={`/admin/users/${u.id}`}>{u.name}</Link></td>
                  <td>{u.email}</td>
                  <td>{u.role ?? "user"}</td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="link">View</Link>
                    {/* <button className="link delete" onClick={() => handleDelete(u.id)}>Delete</button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
