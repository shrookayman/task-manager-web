import axios from 'axios';
const API_URL = 'http://localhost:3001/api'; 


// Get all tasks
export const getTasks = (token) => {
  return axios.get(`${API_URL}/task`, { headers: { Authorization: `Bearer ${token}` } });
};

// Add a new task
export const addTask = (task, token) => {
  return axios.post(`${API_URL}/task`, task, { headers: { Authorization: `Bearer ${token}` } });
};

// Update task status
export const updateTaskStatus = (taskId, status, token) => {
  return axios.patch(`${API_URL}/task/${taskId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
};

// Delete task
export const deleteTask = (taskId, token) => {
  return axios.delete(`${API_URL}/task/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
};
