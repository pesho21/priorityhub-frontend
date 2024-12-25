import React, { useState } from "react";
import Logout from "./auth/Logout";
import axios from "axios";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    priority: "low", 
    recurrenceInterval: null, 
    dueDate: "",
  });
  const [tasks, setTasks] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/task", 
        taskDetails,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`, 
          },
        }
      );

      console.log("Task Created:", response.data);

      setIsMenuOpen(false);

      setTaskDetails({
        title: "",
        description: "",
        priority: "low",
        recurrenceInterval: null,
        dueDate: "",
      });
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true); 
    try {
      const response = await axios.get("http://localhost:3000/task", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      setTasks(response.data); 
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={toggleMenu} style={styles.button}>
        Create Task
      </button>
      <button onClick={fetchTasks} style={styles.button}>
        View My Tasks
      </button>
      <Logout />

      {isMenuOpen && (
        <div style={styles.menu}>
          <h2>Create a New Task</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="title">Task Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={taskDetails.title}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="description">Task Description:</label>
              <textarea
                id="description"
                name="description"
                value={taskDetails.description}
                onChange={handleChange}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                name="priority"
                value={taskDetails.priority}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="recurrenceInterval">Recurrence Interval:</label>
              <select
                id="recurrenceInterval"
                name="recurrenceInterval"
                value={taskDetails.recurrenceInterval}
                onChange={handleChange}
                style={styles.input}
              >
                <option value={null}>None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={taskDetails.dueDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              Create Task
            </button>
            <button type="button" onClick={toggleMenu} style={styles.button}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <div style={styles.taskList}>
          <h2>My Tasks</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} style={styles.taskItem}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Due Date:</strong> {task.dueDate}</p>
                  <p><strong>Recurrence:</strong> {task.recurrenceInterval || "None"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      )}
    </div>
  );
};

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
  },
  menu: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  formGroup: {
    marginBottom: "10px",
  },
  input: {
    padding: "8px",
    fontSize: "1rem",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  textarea: {
    padding: "8px",
    fontSize: "1rem",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ddd",
    minHeight: "100px",
  },
  taskList: {
    marginTop: "20px",
  },
  taskItem: {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  },
};

export default Dashboard;
