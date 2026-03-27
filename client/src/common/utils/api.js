import axios from 'axios';

// Since our Node backend is on port 5000, we route API calls there.
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true // CRITICAL: Allows Axios to automatically send the HttpOnly Refresh Cookie!
});

// Request Interceptor: Automatically attach the JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Advanced Token Rotation State
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Seamlessly catch 401s, rotate the JWT, and retry the request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized (Access Token Expired) AND we haven't already retried this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If a refresh is already happening, queue this request until the new token arrives
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Automatically ask the backend for a new access token using our HttpOnly cookie
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data;
        
        // Save the brand new 15-minute token
        localStorage.setItem('token', accessToken);
        
        // Update the failed request with the new token
        originalRequest.headers.Authorization = 'Bearer ' + accessToken;
        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        
        // Release the queue for any other requests that died at the exact same moment
        processQueue(null, accessToken);
        
        // Finally, retry the original data fetch as if nothing ever happened!
        return api(originalRequest);
      } catch (err) {
        // If the Refresh Token itself is expired/tampered, the user must log in again
        processQueue(err, null);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
