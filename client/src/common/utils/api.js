import axios from 'axios';

// Since our Node backend is on port 5000, we route API calls there.
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Request Interceptor: Automatically attach the JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    // Pull the token from LocalStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handling (e.g., intercept 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If server rejects token via 401 Unauthorized, automatically clear token
      localStorage.removeItem('token');
      // In a real app with Refresh tokens, we'd trigger the /api/auth/refresh logic here!
    }
    return Promise.reject(error);
  }
);

export default api;
