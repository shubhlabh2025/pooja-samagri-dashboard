import { useMemo } from "react";
import { createAxiosClient } from "../api/axiosClient";

export const useApiClient = () => {
  const token = localStorage.getItem("access_token"); // or useContext/Auth store

  const client = useMemo(() => {
    return createAxiosClient({
      baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
      getAuthToken: () => token,
    });
  }, [token]);

  return client;
};
