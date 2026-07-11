import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { GuestSession, User, UserRole } from "@types/user";

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export const authApi = {
  guestEntry: (phoneNumber: string) =>
    apiClient
      .post<ApiResponse<GuestSession>>("/auth/guest", { phoneNumber })
      .then((res) => res.data.data),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<TokenPair>>("/auth/login", payload).then((res) => res.data.data),

  signUp: (payload: SignUpPayload) =>
    apiClient.post<ApiResponse<TokenPair>>("/auth/signup", payload).then((res) => res.data.data),

  me: () => apiClient.get<ApiResponse<User>>("/auth/me").then((res) => res.data.data),

  logout: () => apiClient.post<ApiResponse<null>>("/auth/logout"),
};
