import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { CollectionPoint } from "@types/collectionPoint";

export const collectionPointApi = {
  list: (params: { latitude: number; longitude: number }) =>
    apiClient
      .get<ApiResponse<CollectionPoint[]>>("/collection-points", { params })
      .then((res) => res.data.data),

  detail: (id: string) =>
    apiClient
      .get<ApiResponse<CollectionPoint>>(`/collection-points/${id}`)
      .then((res) => res.data.data),
};
