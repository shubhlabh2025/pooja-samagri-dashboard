import { useMemo } from "react";

import { createAxiosClient } from "../api/axiosClient";

export const useAxiosClient = () => {
 // const token = useSelector((state: RootState) => state.auth.accessToken);

  return useMemo(() => {
    return createAxiosClient({
      baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
      getAuthToken: () => "token",
    });
  }, ["token"]);
};
