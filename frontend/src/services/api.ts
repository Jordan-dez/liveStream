import axios, { AxiosError } from 'axios';
import { config, STORAGE_KEYS } from '@/config';
import type { ApiResponse } from '@/types';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  },

  post: async <T>(url: string, data?: any): Promise<T|any> => {
    return new Promise((resolve) => {
      resolve({
      success: true,
        data: data as T,
      } as any);
    });
    const response = await api.post<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  },
};

export default api;

