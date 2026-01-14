import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; 

export const register = async (data) => {
  console.log('data', data)
  return axios.post(`${API_URL}/auth/register`, data);
};

export const login = async (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

