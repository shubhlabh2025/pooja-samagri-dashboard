// features/auth/authApi.ts
import type { AxiosInstance } from "axios";

export interface SendOtpPayload {
  phone_number: string;
}

export interface VerifyOtpPayload {
  phone_number: string;
  otp_code: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export const createAuthApi = (client: AxiosInstance) => ({
  sendOtp: (payload: SendOtpPayload) =>
    client.post<AuthResponse>("/auth/otp", payload),
  

  verifyOtp: (payload: VerifyOtpPayload) =>
    client.post<AuthResponse>("/auth/verify", payload),
});
