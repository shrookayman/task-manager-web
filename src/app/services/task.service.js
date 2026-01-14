import api from './../interceptor/interceptor';

const API_URL = 'http://localhost:3001/api'; 

export const getTasks = (token, page = 1, limit = 5) => {
  return api.get(`${API_URL}/task?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const addTask = (task, token) => {
  return api.post(`${API_URL}/task`, task, { headers: { Authorization: `Bearer ${token}` } });
};


export const updateTaskStatus = (taskId, status, token) => {
  return api.patch(`${API_URL}/task/${taskId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteTask = (taskId, token) => {
  return api.delete(`${API_URL}/task/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
};
