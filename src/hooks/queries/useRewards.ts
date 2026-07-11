import { useQuery } from "@tanstack/react-query";

import { rewardApi } from "@api/reward";

export function useRewardSummary() {
  return useQuery({
    queryKey: ["rewards", "summary"],
    queryFn: () => rewardApi.summary(),
  });
}

export function useRewardHistory() {
  return useQuery({
    queryKey: ["rewards", "history"],
    queryFn: () => rewardApi.history(),
  });
}
