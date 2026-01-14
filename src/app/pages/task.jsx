import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
} from "../services/task.service";
import LogoutButton from "./../components/ui/LogoutButton";
import {TaskStatus, allowedTransitions, statusColors} from '../utils/constants'

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [titleError, setTitleError] = useState("");
  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchTasks = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await getTasks(token, pageNumber, limit);
      setTasks(res.data.tasks);
      setPage(res.data.page); 
      setTotalPages(res.data.totalPages);
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

        <hr className="header-divider" />
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

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="alert text-center">
          No tasks found. Start by adding a new task
        </div>
      ) : (
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
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="form-select w-100"
                      style={{
                          backgroundColor:
                            task.status === TaskStatus.PENDING
                              ? "#faf1d4"
                              : task.status ===TaskStatus.IN_PROGRESS
                              ? "#b3ccf0"
                              : task.status === TaskStatus.DONE
                              ? "#a4d4bf"
                              : "white",
                          color: "#000000", 
                          fontWeight: "600",
                        }}
                      >
                      <option value={task.status}>
                          {task.status}
                        </option>

                      {allowedTransitions[task.status].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
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
      {tasks?.length > 0 && (
        <div className="d-flex justify-content-between mt-3 mb-5">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => fetchTasks(page - 1)}
          >
            Previous
          </button>
          <div>Page #{page}</div>
          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => fetchTasks(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Task;
