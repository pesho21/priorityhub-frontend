import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

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

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration successful! You can now log in.");
      setFormData({ email: "", username: "", password: "", confirmPassword: "" });
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <div style={styles.container} className="register-container">
      <title>Register</title>
      <h1>Register</h1>
      {error && <div style={styles.errorMessage}className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          {success}
          <button onClick={() => navigate("/login")} style={styles.button}>
            Go to Login
          </button>
        </div>
      )}
      {!success && (
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup} className="form-group">
            <label style={styles.label} htmlFor="email">Email:</label>
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
            <label style={styles.label} htmlFor="username">Username:</label>
            <input
              style={styles.input}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup} className="form-group">
            <label style={styles.label} htmlFor="password">Password:</label>
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

          <div style={styles.formGroup} className="form-group">
            <label style={styles.label} htmlFor="confirmPassword">Confirm Password:</label>
            <input
              style={styles.input}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button style = {styles.button} type="submit">Register</button>
        </form>
      )}
    </div>
  );
};


export default Register;
