import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Priority Hub</h1>
      <p style={styles.subHeading}>Manage your tasks and boost your productivity.</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/register')}>
          Register
        </button>
        <button style={styles.button} onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  subHeading: {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Home;
