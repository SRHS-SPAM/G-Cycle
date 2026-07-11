import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { Container } from "@types/container";

export const containerApi = {
  byCode: (code: string) =>
    apiClient.get<ApiResponse<Container>>(`/containers/code/${code}`).then((res) => res.data.data),

  markReturned: (containerId: string, collectionPointId: string) =>
    apiClient
      .post<ApiResponse<Container>>(`/containers/${containerId}/return`, { collectionPointId })
      .then((res) => res.data.data),

  issue: (storeId: string, count: number) =>
    apiClient
      .post<ApiResponse<Container[]>>(`/containers/issue`, { storeId, count })
      .then((res) => res.data.data),
};
