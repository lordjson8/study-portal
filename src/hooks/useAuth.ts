import type { AuthUser } from "@/contracts/api-contracts";
import {
  selectIsAuthenticated,
  selectIsReady,
  selectUser,
  useAuthStore,
} from "@/store/auth.store";

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (profileId?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isReady = useAuthStore(selectIsReady);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    isAuthenticated,
    isReady,
    login,
    logout,
  };
}
