import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        if (res.data?.token) {
          localStorage.setItem('token', res.data.token);
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
        }

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;