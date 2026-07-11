import { create } from "zustand";

import { SECURE_STORE_KEYS } from "@constants/config";
import { secureStorage } from "@utils/storage";

import type { UserRole } from "@types/user";

interface AuthStoreState {
  isAuthenticated: boolean;
  isGuest: boolean;
  role: UserRole | null;
  phoneNumber: string | null;
  hydrated: boolean;
}

interface AuthStoreActions {
  hydrate: () => Promise<void>;
  loginAsMember: (tokens: { accessToken: string; refreshToken: string }, role: UserRole) => Promise<void>;
  loginAsGuest: (phoneNumber: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState & AuthStoreActions>((set) => ({
  isAuthenticated: false,
  isGuest: false,
  role: null,
  phoneNumber: null,
  hydrated: false,

  hydrate: async () => {
    const [accessToken, role] = await Promise.all([
      secureStorage.get(SECURE_STORE_KEYS.accessToken),
      secureStorage.get(SECURE_STORE_KEYS.role),
    ]);
    set({
      isAuthenticated: !!accessToken,
      role: (role as UserRole) ?? null,
      hydrated: true,
    });
  },

  loginAsMember: async (tokens, role) => {
    await Promise.all([
      secureStorage.set(SECURE_STORE_KEYS.accessToken, tokens.accessToken),
      secureStorage.set(SECURE_STORE_KEYS.refreshToken, tokens.refreshToken),
      secureStorage.set(SECURE_STORE_KEYS.role, role),
    ]);
    set({ isAuthenticated: true, isGuest: false, role });
  },

  loginAsGuest: (phoneNumber) => {
    set({ isAuthenticated: false, isGuest: true, role: "GUEST", phoneNumber });
  },

  logout: async () => {
    await Promise.all([
      secureStorage.remove(SECURE_STORE_KEYS.accessToken),
      secureStorage.remove(SECURE_STORE_KEYS.refreshToken),
      secureStorage.remove(SECURE_STORE_KEYS.role),
    ]);
    set({ isAuthenticated: false, isGuest: false, role: null, phoneNumber: null });
  },
}));
