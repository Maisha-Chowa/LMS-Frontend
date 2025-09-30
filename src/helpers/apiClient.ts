import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { firebaseAuth } from '@/lib/firebase';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get Firebase ID token
      const { token } = await firebaseAuth.getIdToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - try to refresh
      try {
        const { token } = await firebaseAuth.getIdToken(true);

        if (token && error.config) {
          // Retry the request with new token
          error.config.headers.Authorization = `Bearer ${token}`;
          return axios.request(error.config);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        console.error('Token refresh failed:', refreshError);

        // Sign out the user
        await firebaseAuth.signOut();

        // Redirect to login (if in browser)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to make API calls without Firebase token
export const createPublicClient = (): AxiosInstance => {
  return axios.create({
    baseURL: process.env.API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
