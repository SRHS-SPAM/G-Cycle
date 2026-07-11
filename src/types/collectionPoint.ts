export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentCount: number;
  fillRate: number; // 0 - 100
  lastCollectedAt?: string;
  estimatedNextAvailableAt?: string;
  distanceMeters?: number;
}
