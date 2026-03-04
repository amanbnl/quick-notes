import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Define the shape of your backend response
interface ApiResponse {
  status: number;
  message: string;
  data: any[];
  error: any[];
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { message, data, error } = response.data;
    return {
      data: data?.[0] || null,
      message,
      errors: error || []
    } as any;
  },
  (err: AxiosError<ApiResponse>) => {
    const status = err.response?.status;
    const errorMessage = err.response?.data?.message || "An unexpected error occurred";
    if (status === 401) {
      localStorage.clear();
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      console.error(`Error ${status}: ${errorMessage}`);
    }

    // Return flattened error structure even on failure
    return Promise.reject({
      data: null,
      errors: err.response?.data?.error || [errorMessage]
    });
  }
);

export default api;