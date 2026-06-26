import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function loginUser(credentials) {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
}

export async function registerUser(userData) {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
}

export async function getPracticeChallenges() {
  const response = await api.get('/api/practice/challenges');
  return response.data;
}

export async function getCompanyMcqs(company) {
  const response = await api.get('/api/practice/mcqs', {
    params: company ? { company } : undefined,
  });
  return response.data;
}

export async function getInterviewHistory() {
  const response = await api.get('/api/interviews');
  return response.data;
}

export async function getInterviewDetails(id) {
  const response = await api.get(`/api/interviews/${id}`);
  return response.data;
}

export default api;
