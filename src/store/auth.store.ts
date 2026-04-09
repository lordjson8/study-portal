import { authService } from "./../services/auth.service";
import type { AuthUser, Permission } from "@/contracts/api-contracts";
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  isReady: boolean;

  bootstrap: () => Promise<void>;
  login: (profileId?: string) => Promise<void>;
  logout: () => Promise<void>;

  refreshUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isReady: false,

  bootstrap: async () => {
    if (get().isReady) return;

    await authService.init();

    set({ user: authService.getCurrentUser(), isReady: true });
  },

  login: async (profileId?: string) => {
    await authService.login(profileId);
    set({ user: authService.getCurrentUser() });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  refreshUser: async () => {
    await authService.refresh();
  },
}));

const EMPTY_AUTHORITIES: readonly Permission[] = Object.freeze([]);
export const selectUser = (s: AuthState): AuthUser | null => s.user;
export const selectIsAuthenticated = (s: AuthState): boolean => s.user !== null;
export const selectIsReady = (s: AuthState): boolean => s.isReady;
export const selectAuthorities = (s: AuthState): readonly Permission[] => {
  if ("user" in s && s.user !== null) {
    return s.user?.authorities;
  }
  return EMPTY_AUTHORITIES;
};
