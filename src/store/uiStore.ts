import { create } from "zustand";

type ToastVariant = "success" | "error" | "info";

interface ToastState {
  visible: boolean;
  message: string;
  variant: ToastVariant;
}

interface UiStoreState {
  isGlobalLoading: boolean;
  toast: ToastState;
  activeModal: string | null;
}

interface UiStoreActions {
  setGlobalLoading: (value: boolean) => void;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiStoreState & UiStoreActions>((set) => ({
  isGlobalLoading: false,
  toast: { visible: false, message: "", variant: "info" },
  activeModal: null,

  setGlobalLoading: (value) => set({ isGlobalLoading: value }),

  showToast: (message, variant = "info") =>
    set({ toast: { visible: true, message, variant } }),

  hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),

  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
