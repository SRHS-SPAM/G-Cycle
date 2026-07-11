import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL, SECURE_STORE_KEYS } from "@constants/config";
import { useUiStore } from "@store/uiStore";
import { secureStorage } from "@utils/storage";

import type { ApiError } from "@types/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.get(SECURE_STORE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single place for error handling: every screen relies on this instead of
// wrapping each request in try/catch for the common cases.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ code?: string; message?: string }>) => {
    const apiError: ApiError = {
      code: error.response?.data?.code ?? "UNKNOWN",
      message: error.response?.data?.message ?? "일시적인 오류가 발생했어요. 다시 시도해주세요.",
      status: error.response?.status ?? 0,
    };

    useUiStore.getState().showToast(apiError.message, "error");

    return Promise.reject(apiError);
  }
);
