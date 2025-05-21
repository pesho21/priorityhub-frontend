import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sprints = () => {
  const [sprints, setSprints] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [sprintDetails, setSprintDetails] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSprints();
  }, []);

  useEffect(() => {
    if (selectedSprint) {
      fetchTasks(selectedSprint);
    }
  }, [selectedSprint]);

  const fetchSprints = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE}/sprint`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSprints(response.data);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  const fetchTasks = async (sprintId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE}/sprint/${sprintId}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchReport = async (sprintId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE}/sprint/${sprintId}/report`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSprintDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE}/sprint`, sprintDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSprints([...sprints, response.data]);
      toggleMenu();
      setSprintDetails({
        name: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setSprintDetails({
      name: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sprints</h1>

      <button onClick={toggleMenu} style={styles.button}>
        {isMenuOpen ? "Cancel" : "Create Sprint"}
      </button>
      <button style={styles.button} onClick={() => navigate("/dashboard")}>
        Back To Dashboard
      </button>

      {isMenuOpen && (
        <div style={styles.menu}>
          <h2>Create a New Sprint</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Sprint Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={sprintDetails.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={sprintDetails.startDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={sprintDetails.endDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              Create Sprint
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h2>Select Sprint</h2>
        <select
          onChange={(e) => setSelectedSprint(e.target.value)}
          value={selectedSprint || ""}
          style={styles.input}
        >
          <option value="" disabled>
            Select a sprint
          </option>
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => fetchReport(selectedSprint)}
          style={styles.button}
          disabled={!selectedSprint}
        >
          Generate Report
        </button>

        {report && (
          <div style={styles.report}>
            <h3>Report for Sprint {selectedSprint}</h3>
            <p>Total Tasks Completed: {report.totalCompleted}</p>
            <p>Low Priority Tasks: {report.priorityCounts.low || 0}</p>
            <p>Medium Priority Tasks: {report.priorityCounts.medium || 0}</p>
            <p>High Priority Tasks: {report.priorityCounts.high || 0}</p>
            <p>Total Time Spent Working on Tasks: {" "}{Math.floor(report.totalTime / 60)} minutes{" "}{Math.floor(report.totalTime % 60)} seconds</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Tasks</h2>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} style={styles.taskItem}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Assignees:</strong>{" "}
                  {task.assignees.map((user) => user.username).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks in this sprint.</p>
        )}
      </div>
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
  taskItem: {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  },
  report: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
};

export default Sprints;
