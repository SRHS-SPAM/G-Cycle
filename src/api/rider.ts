import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { CompletePickupPayload, PickupTask } from "@types/rider";

export const riderApi = {
  tasks: (params: { latitude: number; longitude: number }) =>
    apiClient
      .get<ApiResponse<PickupTask[]>>("/rider/tasks", { params })
      .then((res) => res.data.data),

  claim: (taskId: string) =>
    apiClient
      .post<ApiResponse<PickupTask>>(`/rider/tasks/${taskId}/claim`)
      .then((res) => res.data.data),

  complete: (payload: CompletePickupPayload) =>
    apiClient
      .post<ApiResponse<PickupTask>>(`/rider/tasks/${payload.taskId}/complete`, payload)
      .then((res) => res.data.data),
};
