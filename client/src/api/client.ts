import axios from 'axios';

const PRODUCTION_API_URL = 'https://college-discovery-9sux.onrender.com/api/';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || PRODUCTION_API_URL).replace(/\/$/, '') + '/',
});

console.log('[API Client] Initialized with baseURL:', api.defaults.baseURL);
console.log('[API Client] VITE_API_URL:', import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging
  const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
  console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
  
  return config;
});

export default api;
