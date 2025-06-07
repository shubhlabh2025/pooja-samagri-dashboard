import type { AxiosInstance } from "axios";

export const userApi = (client: AxiosInstance) => ({
  getUsers: (page = 1) => client.get("/users", { params: { page } }),
});
