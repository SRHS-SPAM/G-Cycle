import { create } from "zustand";

interface DraftLineItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderStoreState {
  storeId: string | null;
  containerCode: string | null;
  draftItems: DraftLineItem[];
}

interface OrderStoreActions {
  startOrder: (storeId: string, containerCode?: string) => void;
  setQuantity: (item: Omit<DraftLineItem, "quantity">, quantity: number) => void;
  clearOrder: () => void;
  totalPrice: () => number;
}

export const useOrderStore = create<OrderStoreState & OrderStoreActions>((set, get) => ({
  storeId: null,
  containerCode: null,
  draftItems: [],

  startOrder: (storeId, containerCode) =>
    set({ storeId, containerCode: containerCode ?? null, draftItems: [] }),

  setQuantity: (item, quantity) =>
    set((state) => {
      const withoutItem = state.draftItems.filter((d) => d.menuItemId !== item.menuItemId);
      if (quantity <= 0) return { draftItems: withoutItem };
      return { draftItems: [...withoutItem, { ...item, quantity }] };
    }),

  clearOrder: () => set({ storeId: null, containerCode: null, draftItems: [] }),

  totalPrice: () => get().draftItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
