export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.g-cycle.kr/api/v1";

export const SECURE_STORE_KEYS = {
  accessToken: "gcycle.accessToken",
  refreshToken: "gcycle.refreshToken",
  role: "gcycle.role",
} as const;

/** Bottom-tab fill-rate thresholds, kept in one place so map + badges agree. */
export const FILL_RATE_THRESHOLDS = {
  mid: 41,
  high: 76,
} as const;

export const GANGNAM_DEFAULT_REGION = {
  latitude: 37.4979,
  longitude: 127.0276,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};
