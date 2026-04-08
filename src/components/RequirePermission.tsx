import type { Permission } from "@/contracts/api-contracts";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";

interface RequirePermissionProps {
  permission?: Permission;
  allOf?: readonly Permission[];
  redirectTo?: string;
}

export function RequirePermission({
  permission,
  allOf,
  redirectTo = "/",
}: RequirePermissionProps): ReactNode {
  const { isAuthenticated, isReady } = useAuth();
  const { hasAllPermissions, hasPermission } = usePermissions();

  if (!isReady) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let allowed = false;

  if (permission) allowed = hasPermission(permission);
  if (allOf) allowed = hasAllPermissions(allOf);

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
