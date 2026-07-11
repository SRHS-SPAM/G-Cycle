import { apiClient } from "./client";

import type { ApiResponse } from "@types/api";
import type { CreateOrderPayload, Order } from "@types/order";

export const orderApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<ApiResponse<Order>>("/orders", payload).then((res) => res.data.data),

  detail: (orderId: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`).then((res) => res.data.data),

  history: () =>
    apiClient.get<ApiResponse<Order[]>>("/orders/history").then((res) => res.data.data),
};
