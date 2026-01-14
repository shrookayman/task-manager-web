import { useEffect, useState } from 'react';
import { getTasks, addTask, updateTaskStatus, deleteTask } from '../services/task.service';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks(token);
      console.log('res-------', res)
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

  // Handle form input
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return alert('Title is required');

    try {
      await addTask(newTask, token);
      setNewTask({ title: '', description: '' });
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

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId, token);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Task Management</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            className="form-control"
            value={newTask.title}
            onChange={handleChange}
            required
          />
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
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
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
                <td>{task.description}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="form-select"
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
      )}
    </div>
  );
};

export default Task;
