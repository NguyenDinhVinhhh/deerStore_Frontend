import React from "react";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permission";

export default function ProtectedRoute({ permission, children }) {
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  if (!token || userType !== "ADMIN") {
    console.warn("Truy cập trái phép vào vùng quản trị!");
    return <Navigate to="/" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/admin/no-permission" replace />;
  }

  return children;
}
