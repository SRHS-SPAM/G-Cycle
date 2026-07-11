import { create } from "zustand";

type SortMode = "FILL_RATE" | "DISTANCE" | "INCENTIVE";

interface RiderStoreState {
  sortMode: SortMode;
  minFillRate: number;
  selectedCollectionPointId: string | null;
}

interface RiderStoreActions {
  setSortMode: (mode: SortMode) => void;
  setMinFillRate: (value: number) => void;
  selectCollectionPoint: (id: string | null) => void;
}

export const useRiderStore = create<RiderStoreState & RiderStoreActions>((set) => ({
  sortMode: "FILL_RATE",
  minFillRate: 0,
  selectedCollectionPointId: null,

  setSortMode: (mode) => set({ sortMode: mode }),
  setMinFillRate: (value) => set({ minFillRate: value }),
  selectCollectionPoint: (id) => set({ selectedCollectionPointId: id }),
}));
