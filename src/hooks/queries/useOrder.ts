import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { orderApi } from "@api/order";

import type { CreateOrderPayload } from "@types/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "history"] });
    },
  });
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderApi.detail(orderId),
    enabled: !!orderId,
  });
}

export function useOrderHistory() {
  return useQuery({
    queryKey: ["orders", "history"],
    queryFn: () => orderApi.history(),
  });
}
