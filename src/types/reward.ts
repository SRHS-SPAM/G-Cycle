export type RewardHistoryType = "EARNED" | "REDEEMED" | "REFUNDED";

export interface RewardSummary {
  points: number;
  refundableAmount: number;
  totalContainersReturned: number;
}

export interface RewardHistoryItem {
  id: string;
  type: RewardHistoryType;
  amount: number;
  description: string;
  createdAt: string;
}
