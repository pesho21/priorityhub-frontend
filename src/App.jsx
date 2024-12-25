import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectRoute from "./components/RedirectRoute";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectRoute>
              <Login />
            </RedirectRoute>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectRoute>
              <Register />
            </RedirectRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
