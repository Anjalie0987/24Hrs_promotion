import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      (error.response?.status === 404 && error.config?.url === '/users/me')
    ) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 429) {
      if (typeof window !== 'undefined') {
        toast.error("Too many requests. Please wait a moment and try again.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;