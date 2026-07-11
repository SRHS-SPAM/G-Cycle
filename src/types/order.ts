export type OrderStatus =
  | "CREATED"
  | "PAID"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderLineItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  userId?: string;
  guestPhoneNumber?: string;
  status: OrderStatus;
  items: OrderLineItem[];
  containerIds: string[];
  totalPrice: number;
  createdAt: string;
}

export interface CreateOrderPayload {
  storeId: string;
  items: { menuItemId: string; quantity: number }[];
  guestPhoneNumber?: string;
}
