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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isReady: false,

  bootstrap: async () => {
    try {
      await authService.init();
      console.log(
        "Auth initialized, current user:",
        authService.getCurrentUser(),
      );
      set({ user: authService.getCurrentUser(), isReady: true });
    } catch (e) {
      console.error("Auth init failed", e);
      set({ user: null, isReady: true });
    }
  },

  login: async (profileId?: string) => {
    await authService.login(profileId);
    set({ user: authService.getCurrentUser() });
  },

  logout: async () => {
    await authService.logout();
    if (import.meta.env["VITE_AUTH_MODE"] === "mock") {
      set({ user: null, isReady: true });
    } else {
      set({ user: null, isReady: false });
    }
  },

  refreshUser: async () => {
    await authService.refresh();
    set({ user: authService.getCurrentUser() });
  },
}));

const EMPTY_AUTHORITIES: readonly Permission[] = Object.freeze([]);
export const selectUser = (s: AuthState): AuthUser | null => s.user;
export const selectIsAuthenticated = (s: AuthState): boolean => s.user !== null;
export const selectIsReady = (s: AuthState): boolean => s.isReady;
export const selectAuthorities = (s: AuthState): readonly Permission[] =>
  s.user?.authorities ?? EMPTY_AUTHORITIES;
