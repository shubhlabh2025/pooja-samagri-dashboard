import type { AxiosInstance } from "axios";

import type { ConfigurationModel } from "@/interfaces/configurations";
import type { ApiResponse } from "@/interfaces/api-response";

export const createConfigurationApi = (client: AxiosInstance) => ({
  getConfiguration: () => {
    return client.get<ApiResponse<ConfigurationModel>>(`/api/configurations/`);
  },

  updateConfiguration: (updates: Partial<ConfigurationModel>) =>
    client.patch<ApiResponse<ConfigurationModel>>(
      `/api/configurations`,
      updates,
    ),
});
