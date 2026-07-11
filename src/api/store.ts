import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { MenuItem, Store } from "@types/store";

export const storeApi = {
  list: (params: { latitude: number; longitude: number }) =>
    apiClient
      .get<ApiResponse<Store[]>>("/stores", { params })
      .then((res) => res.data.data),

  detail: (storeId: string) =>
    apiClient.get<ApiResponse<Store>>(`/stores/${storeId}`).then((res) => res.data.data),

  menu: (storeId: string) =>
    apiClient
      .get<ApiResponse<MenuItem[]>>(`/stores/${storeId}/menu`)
      .then((res) => res.data.data),
};
