import axios from "axios";
import axiosRetry from "axios-retry";
import type { AxiosInstance } from "axios";

interface CreateAxiosClientOptions {
  baseURL: string;
  getAuthToken?: () => string | null;
}

export function createAxiosClient({ baseURL, getAuthToken }: CreateAxiosClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Retry setup
  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
  });

  // Request interceptor
  instance.interceptors.request.use((config) => {
    const token = getAuthToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        // Optionally refresh token logic here
      }
      return Promise.reject(formatError(error));
    }
  );

  return instance;
}

function formatError(error: any): Error {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.request) {
      return new Error("No response received from the server");
    }
    return new Error("Axios setup failed");
  }
  return new Error("Unexpected error");
}
