import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
} from "../services/task.service";
import LogoutButton from "./../components/ui/LogoutButton";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [titleError, setTitleError] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks(token);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "title") {
      setTitleError("");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const trimmedTitle = newTask.title.trim();

    if (!trimmedTitle) {
      setTitleError("Task title is required");
      return;
    }

    setTitleError("");

    try {
      newTask.title = trimmedTitle;
      await addTask(newTask, token);
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Update status
  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status, token);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId, token);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className=" mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 header-bar">
          <span className="greeting-text">
            Hello, <span className="fw-semibold text-primary">{user.name}</span>
          </span>
          <LogoutButton />
        </div>

        <hr className="header-divider"/>
        {/* Your task form and table */}
      </div>
      <h4 class="mt-5">Add New Task</h4>
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            className={`form-control ${titleError ? "is-invalid" : ""}`}
            value={newTask.title}
            onChange={handleChange}
          />

          {titleError && <div className="invalid-feedback">{titleError}</div>}
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            className="form-control"
            value={newTask.description}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            padding: "0.5rem 0.5rem",
            color: "#0d6efd",
            backgroundColor: "white",
          }}
        >
          Add
        </button>
      </form>
      <h4>My To Do List</h4>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      )  : tasks.length === 0 ? (
        <div className="alert text-center">
          No tasks found. Start by adding a new task 
        </div>
      )
      : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description || "N/A"}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      className="form-select w-100"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Task;
