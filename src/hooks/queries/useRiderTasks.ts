import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { riderApi } from "@api/rider";

import type { Coordinates } from "@hooks/useLocation";
import type { CompletePickupPayload } from "@types/rider";

export function useRiderTasks(coords: Coordinates) {
  return useQuery({
    queryKey: ["rider", "tasks", coords.latitude, coords.longitude],
    queryFn: () => riderApi.tasks(coords),
    refetchInterval: 20000,
  });
}

export function useClaimTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => riderApi.claim(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rider", "tasks"] }),
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompletePickupPayload) => riderApi.complete(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rider", "tasks"] }),
  });
}
