import axios from 'axios';
import { getToken } from './helper';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:2000/api',
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (attach token)
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle global errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized (optional: logout user or redirect)
        console.error('Unauthorized access - redirect to login');
      }

    //   if (status === 500) {
    //     console.error('Server error');
    //   }
    } else if (error.request) {
      // No response received
      console.error('Network error');
    } else {
      // Something else
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;