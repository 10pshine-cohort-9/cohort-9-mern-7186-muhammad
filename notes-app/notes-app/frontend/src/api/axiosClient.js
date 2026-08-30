import axios from 'axios';

// Same-origin '/api' works both in the Vite dev server (proxied to the
// backend — see vite.config.js) and in production when the frontend is
// served behind the same domain/reverse-proxy as the API.
const baseURL = '/api';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if present) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('notes_app_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the backend's { success, message, data } envelope and
// normalize errors so callers can just read `error.message`.
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('notes_app_token');
      localStorage.removeItem('notes_app_user');
    }

    return Promise.reject({ message, status });
  }
);

export default axiosClient;
