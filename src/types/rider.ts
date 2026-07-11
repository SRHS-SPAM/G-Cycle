export type PickupTaskStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface PickupTask {
  id: string;
  collectionPointId: string;
  collectionPointName: string;
  fillRate: number;
  containerCount: number;
  incentiveAmount: number;
  distanceMeters?: number;
  status: PickupTaskStatus;
  createdAt: string;
}

export interface CompletePickupPayload {
  taskId: string;
  collectedCount: number;
  handoverLocation: "WASHING_FACTORY" | "PARTNER_STORE";
}
