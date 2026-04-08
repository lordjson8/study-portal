import type { Permission } from "@/contracts/api-contracts";
import { usePermissions } from "@/hooks/usePermissions";
import { type ReactNode } from "react";

type ProtectedComponentProps =
  | {
      permission: Permission;
      anyOf?: never;
      allOf?: never;
      children: ReactNode;
      fallback?: ReactNode;
    }
  | {
      permission?: never;
      anyOf: readonly Permission[];
      allOf?: never;
      children: ReactNode;
      fallback?: ReactNode;
    }
  | {
      permission?: never;
      anyOf?: never;
      allOf: readonly Permission[];
      children: ReactNode;
      fallback?: ReactNode;
    };


export function ProtectedComponent(props: ProtectedComponentProps): ReactNode {
    const { hasAllPermissions,hasAnyPermission,hasPermission } = usePermissions()

    let allowed = false;

    if('permission' in props && props.permission){
        allowed = hasPermission(props.permission);
    } else if('anyOf' in props && props.anyOf){
        allowed = hasAnyPermission(props.anyOf);
    } else if('allOf' in props && props.allOf){
        allowed = hasAllPermissions(props.allOf);
    }

    
    if (!allowed) {
        return props.fallback ?? null;
    }
    return props.children
}