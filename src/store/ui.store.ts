import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeCidebar: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  isSidebarOpen: false,

  openSidebar: () => set({ isSidebarOpen: true }),
  closeCidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
}));
