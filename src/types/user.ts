export type UserRole = "GUEST" | "MEMBER" | "RIDER" | "STORE_OWNER" | "ADMIN";

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
  email?: string;
  createdAt: string;
}

export interface GuestSession {
  phoneNumber: string;
  guestToken: string;
}
