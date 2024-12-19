import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth/isAuthenticated";

const RedirectRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isLoggedIn: false,
  });

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = isAuthenticated();
      setAuthState({ loading: false, isLoggedIn });
    };

    checkAuth();
  }, []);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return authState.isLoggedIn ? <Navigate to="/dashboard" /> : children;
};

export default RedirectRoute;
