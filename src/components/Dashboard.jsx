import React, { useState, useEffect } from "react";
import Logout from "./auth/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    priority: "low",
    recurrenceInterval: null,
    dueDate: "",
    sprintId: "",
    assignees: [],
  });
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [users, setUsers] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsEditing(false);
    setEditingTaskId(null);
    setTaskDetails({
      title: "",
      description: "",
      priority: "low",
      recurrenceInterval: null,
      dueDate: "",
      sprintId: "",
      assignees: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAssigneeChange = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, (option) => option.value);
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      assignees: selectedUsers,
    }));
  };

  const handleMarkAsComplete = async (taskId) => {
    try {
      await axios.patch(
        `http://localhost:3000/task/${taskId}`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("Task marked as complete:", taskId);
      fetchTasks(); 
    } catch (err) {
      console.error("Error marking task as complete:", err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isEditing
        ? `http://localhost:3000/task/${editingTaskId}`
        : "http://localhost:3000/task";
      const method = isEditing ? "patch" : "post";

      const response = await axios[method](endpoint, taskDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(isEditing ? "Task Updated:" : "Task Created:", response.data);

      toggleMenu();
      fetchTasks();
    } catch (err) {
      console.error(isEditing ? "Error updating task:" : "Error creating task:", err);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/task", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSprints = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sprint/filter/available", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSprints(response.data);
    } catch (err) {
      console.error("Error fetching sprints:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setEditingTaskId(task.id);
    setTaskDetails({
      title: task.title,
      description: task.description,
      priority: task.priority,
      recurrenceInterval: task.recurrenceInterval,
      dueDate: task.dueDate,
      sprintId: task.sprintId || "",
      assignees: task.assignees.map((assignee) => assignee.id),
    });
    setIsMenuOpen(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Task Deleted:", taskId);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAvailableSprints();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={toggleMenu} style={styles.button}>
        Create Task
      </button>
      <button onClick={fetchTasks} style={styles.button}>
        Refresh Task list
      </button>
      <button style={styles.button} onClick={() => navigate("/sprints")}>
        My sprints
      </button>
      <Logout />

      {isMenuOpen && (
        <div style={styles.menu}>
          <h2>{isEditing ? "Edit Task" : "Create a New Task"}</h2>
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
            <div style={styles.formGroup}>
              <label htmlFor="sprintId">Select Sprint:</label>
              <select
                id="sprintId"
                name="sprintId"
                value={taskDetails.sprintId}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="" disabled>
                  Select a Sprint
                </option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} (Ends on:{" "}
                    {new Date(sprint.endDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="assignees">Assign Users:</label>
              <select
                id="assignees"
                name="assignees"
                multiple
                value={taskDetails.assignees}
                onChange={handleAssigneeChange}
                style={styles.input}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" style={styles.button}>
              {isEditing ? "Update Task" : "Create Task"}
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
                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>
                <p>
                  <strong>Due Date:</strong> {task.dueDate}
                </p>
                <p>
                  <strong>Recurrence:</strong> {task.recurrenceInterval || "None"}
                </p>
                <p>
                  <strong>Sprint:</strong>{" "}
                  {task.sprintId
                    ? sprints.find((s) => s.id === task.sprintId)?.name || "N/A"
                    : "Not Assigned"}
                </p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <button onClick={() => handleEdit(task)} style={styles.button}>
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} style={styles.button}>
                  Delete
                </button>
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleMarkAsComplete(task.id)}
                    style={styles.button}
                  >
                    Mark as Complete
                  </button>
                )}
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
