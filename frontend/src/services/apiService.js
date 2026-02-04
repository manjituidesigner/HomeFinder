// API service
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAuthToken } from './authStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const baseUrl = API_BASE_URL;
    const isLocalhost = typeof baseUrl === 'string' && baseUrl.includes('localhost');
    const hint = isLocalhost
      ? ' (If running on a real phone, localhost will not reach your PC. Set EXPO_PUBLIC_API_URL to http://<PC_IP>:<PORT>/api)'
      : '';

    const originalMessage = error?.message || 'Request failed';
    const status = error?.response?.status;
    const statusText = status ? ` HTTP ${status}` : '';

    const enhancedMessage = `${originalMessage}${statusText} | API_BASE_URL=${baseUrl}${hint}`;

    if (error && typeof error === 'object') {
      error.message = enhancedMessage;
    }

    return Promise.reject(error);
  }
);

export default api;