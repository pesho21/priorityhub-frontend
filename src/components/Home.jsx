import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./auth/isAuthenticated";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  useEffect(() => {
    document.title = 'PriorityHub';
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
  };

  return (
    <div style={styles.container}>
      <title>PriorityHub</title>
      <h1>Welcome to Priority Hub</h1>
      <div className="home-buttons">
        {!loggedIn && (
          <>
            <button style={styles.button} onClick={() => navigate("/login")}>
              Login
            </button>
            <button style={styles.button} onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
        {loggedIn && (
          <button style={styles.button} onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
