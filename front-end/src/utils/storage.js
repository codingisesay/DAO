import axios from 'axios';
import { API_ENDPOINTS } from '../services/api';
import { AUTH_KEYS } from '../services/authService';
import { handleApiError } from '../utils/ApiError';

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImVtYWlsIjoiYWdlbnRAZXhhbXBsZS5jb20iLCJuYW1lIjoiQWdlbnQgVXNlciIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTc0NzY2NjA0Mn0.AdJj3GlgzHGpJ2_M7-WIH9jTlqICoZRZbgNBeVl91TI';
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export const apiService = {
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async post(url, data, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  async put(url, data, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async postMultipart(url, formData, config = {}) {
    try {
      const response = await api.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  // decided to delete below content mutually
  // async delete(url, config = {}) {
  //   try {
  //     const response = await api.delete(url, config);
  //     return response.data;
  //   } catch (error) {
  //     handleApiError(error);
  //   }
  // }
};
export default api;