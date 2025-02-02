// services/utils/Axios.utis.js
import axios from 'axios';

export const AxiosRouter = axios.create({
  baseURL: import.meta.url.VITE_APP_URL ,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});


AxiosRouter.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosRouter.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      
    }
    return Promise.reject(error);
  }
);