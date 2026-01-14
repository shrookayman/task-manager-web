// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // your API URL

const api = axios.create({
  baseURL: API_URL,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // redirect to login
      alert('Session expired. Please login again.');
    } else if (error.response?.data?.message) {
      alert(error.response.data.message); // server error message
    } else {
      alert('Something went wrong!');
    }

    return Promise.reject(error);
  }
);

export default api;
