import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [usernameForm, setUsernameForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Login';
  }, []);

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
      width: "100px",
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
    divider: {
      margin: "20px 0",
      fontWeight: "bold",
    },
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setUsernameForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}/auth/login`,
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

  const handleUsernameLogin = async (e) => {
    e.preventDefault();
    try {
      const resolveResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE}/users/${encodeURIComponent(usernameForm.username)}/email`
      );
      const email = resolveResponse.data.email;

      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE}/auth/login`,
        { email, password: usernameForm.password }
      );

      localStorage.setItem("token", loginResponse.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid username or password. Please try again.";
      setError(message);
    }
  };

  return (
    <div style={styles.container} className="login-container">
      <title>Login</title>
      <h1>Login</h1>
      {error && <div style={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleEmailLogin}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="email">
            Email:
          </label>
          <input
            style={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password">
            Password:
          </label>
          <input
            style={styles.input}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleEmailChange}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Login with Email
        </button>
      </form>

      <div style={styles.divider}>OR</div>

      {/* Username Login */}
      <form onSubmit={handleUsernameLogin}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="username">
            Username:
          </label>
          <input
            style={styles.input}
            type="text"
            id="username"
            name="username"
            value={usernameForm.username}
            onChange={handleUsernameChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password2">
            Password:
          </label>
          <input
            style={styles.input}
            type="password"
            id="password2"
            name="password"
            value={usernameForm.password}
            onChange={handleUsernameChange}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Login with Username
        </button>
      </form>
    </div>
  );
};

export default Login;
