import type { AxiosInstance } from "axios";

export interface BroadcastPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface BroadcastResponse {
  status: string;
  message: string;
  data: { queued: boolean };
}

export const createNotificationApi = (client: AxiosInstance) => ({
  broadcast: (payload: BroadcastPayload) =>
    client.post<BroadcastResponse>("/api/notifications/broadcast", payload),
});
