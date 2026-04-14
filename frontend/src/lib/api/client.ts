import axios from 'axios';

// Client-side API instance — calls BFF proxy routes (never Express directly)
const apiClient = axios.create({
  baseURL: '/bff/proxy',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Response interceptor: auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post('/bff/auth/refresh');
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
