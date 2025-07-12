import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1", // Adjust as per your API
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Example: const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer \${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: if (error.response.status === 401) { logoutUser(); }
    return Promise.reject(error);
  }
);

export default api;
