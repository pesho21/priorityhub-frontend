import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center", 
      height: "100vh",
      textAlign: "center",
    },
    formGroup: {
      display: "flex",
      flexDirection: "row", 
      alignItems: "center",
      justifyContent: "center",
      margin: "10px 0",
    },
    label: {
      width: "80px", 
      textAlign: "right",
      marginRight: "10px",
    },
    input: {
      border: "none",
      borderBottom: "2px solid black",
      outline: "none",
      margin: "6px 0",
      width: "200px", 
    },
    button: {
      padding: "10px 20px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "orange",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "10px",
    },
    errorMessage: {
      color: "red",
      marginBottom: "10px",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}auth/login`,
        formData
      );
      localStorage.setItem("token", response.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid login credentials. Please try again.";
      setError(message);
    }
  };

  return (
    <div style={styles.container} className="login-container">
      <h1>Login</h1>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup} className="form-group">
          <label style={styles.label} htmlFor="email">
            Email:
          </label>
          <input
            style={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup} className="form-group">
          <label style={styles.label} htmlFor="password">
            Password:
          </label>
          <input
            style={styles.input}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
