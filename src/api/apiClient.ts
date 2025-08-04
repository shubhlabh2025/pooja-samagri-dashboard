// api/apiClient.ts
import axios from "axios";
import { env } from "@/env/env";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

// Create axios instance
const axiosClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token from localStorage to each request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not a retry of the original request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if a refresh token request is already in progress
      await mutex.waitForUnlock();

      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            // No refresh token, logout the user
            // For example:
            // logout();
            return Promise.reject(error);
          }

          // --- ⚠️ START OF CHANGE ⚠️ ---
          // Use a new axios instance to avoid interceptor recursion
          const refreshInstance = axios.create({
            baseURL: env.API_BASE_URL,
            headers: {
              "Content-Type": "application/json",
              // ✅ ADD THE REFRESH TOKEN TO THE AUTHORIZATION HEADER
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          // Make the refresh token request with no body, as the token is in the header
          const refreshResponse = await refreshInstance.post("/auth/refresh");
          // --- ⚠️ END OF CHANGE ⚠️ ---

          const { access_token, refresh_token } = refreshResponse.data.data;

          // Update tokens in localStorage
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("refreshToken", refresh_token);

          // Update the header of the original request and retry
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout the user
          // logout();
          return Promise.reject(refreshError);
        } finally {
          release();
        }
      } else {
        // A refresh request is in progress, wait for it to complete
        await mutex.waitForUnlock();
        // Update the header of the original request with the new token
        const newAccessToken = localStorage.getItem("accessToken");
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
