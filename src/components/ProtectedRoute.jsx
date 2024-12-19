import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth/isAuthenticated";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
