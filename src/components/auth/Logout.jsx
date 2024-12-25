import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const styles = {
    button: {
      padding: "10px 20px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "orange",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "10px",
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <button style={styles.button} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
