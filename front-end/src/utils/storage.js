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

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
//     const userCode = localStorage.getItem(AUTH_KEYS.USER_CODE);
//     const branchCode = localStorage.getItem(AUTH_KEYS.BRANCH_CODE);
//     const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
//     const operationDate = localStorage.getItem(AUTH_KEYS.OPERATION_DATE);
//     const lastLogin = localStorage.getItem(AUTH_KEYS.LAST_LOGIN_DATE);
//     if (token) {
//         // config.headers['Authorization'] = `Bearer ${token}`;
//         config.headers['Authorization'] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImVtYWlsIjoiYWdlbnRAZXhhbXBsZS5jb20iLCJuYW1lIjoiQWdlbnQgVXNlciIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTc0Nzc0Mzg1NH0.8Ep8R_dWyOu39OkJritRmrLSd0mGXvUrQleNywNaFhQ`;
//         config.headers['X-Username'] = userCode;
//         config.headers['X-BranchCode'] = branchCode;
//         config.headers['Refresh-Token'] = refreshToken;
//         config.headers['Operation-Date'] = operationDate;
//         //config.headers['Last-Login'] = lastLogin;

//     }
//     return config;
// });

api.interceptors.request.use((config) => {
  // Hardcoded token for testing
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImVtYWlsIjoiYWdlbnRAZXhhbXBsZS5jb20iLCJuYW1lIjoiQWdlbnQgVXNlciIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTc0Nzc0NjY5Mn0.SwZarXNbK0dM-fZKlUHiqkNUfEJUkWJkmvh7ka9WTO8";

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
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