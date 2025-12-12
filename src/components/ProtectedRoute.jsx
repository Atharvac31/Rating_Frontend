import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // While we are fetching token/user from localStorage
  if (loading) return <div>Loading...</div>;

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // User logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Access allowed → render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
