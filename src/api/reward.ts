import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { RewardHistoryItem, RewardSummary } from "@types/reward";

export const rewardApi = {
  summary: () =>
    apiClient.get<ApiResponse<RewardSummary>>("/rewards/summary").then((res) => res.data.data),

  history: () =>
    apiClient
      .get<ApiResponse<RewardHistoryItem[]>>("/rewards/history")
      .then((res) => res.data.data),
};
