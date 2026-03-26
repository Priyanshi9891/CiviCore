
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role mismatch
  if (role && userRole !== role) {
    // Redirect based on actual role
    if (userRole === "admin") return <Navigate to="/admin-dashboard" />;
    if (userRole === "worker") return <Navigate to="/worker-dashboard" />;
    if (userRole === "citizen") return <Navigate to="/citizen-dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;