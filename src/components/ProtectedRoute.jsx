import React from "react";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permission";

export default function ProtectedRoute({ permission, children }) {
  if (!hasPermission(permission)) {
    return <Navigate to="/no-permission" replace />;
  }
  return children;
}
