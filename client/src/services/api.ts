import axios from 'axios';

// Base Axios instance
export const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true // Uncomment if you are setting secure HTTP-only cookies from the backend
});

// Interceptor for attaching tokens (if you decide to use JWT in localStorage)
apiClient.interceptors.request.use((config) => {
  // If you store token in localStorage, attach it here
  // const token = localStorage.getItem('kaizen_token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: async (data: any) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }
};
