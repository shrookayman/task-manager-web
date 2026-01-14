// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
   if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
      alert('Session expired. Please login again.');
    } else if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('Something went wrong!');
    }

    return Promise.reject(error);
  }
);

export default api;
