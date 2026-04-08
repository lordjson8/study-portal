import type { Permission } from "@/contracts/api-contracts";
import { selectAuthorities, useAuthStore } from "@/store/auth.store";
import { useMemo } from "react";

interface UsePermissionsReturn {
  authorities: readonly Permission[];
  hasPermission: (scope: Permission) => boolean;
  hasAnyPermission: (scopes: readonly Permission[]) => boolean;
  hasAllPermissions: (scopes: readonly Permission[]) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const authorities = useAuthStore(selectAuthorities);

  return useMemo<UsePermissionsReturn>(() => {
    const set = new Set<Permission>(authorities);
    const hasPermission = (scope: Permission): boolean => set.has(scope);
    const hasAnyPermission = (scope: readonly Permission[]): boolean =>
      scope.some((s) => set.has(s));
    const hasAllPermissions = (scope: readonly Permission[]): boolean =>
      scope.every((s) => set.has(s));

    return {
      authorities,
      hasAllPermissions,
      hasAnyPermission,
      hasPermission,
    };
  }, [authorities]);
}
