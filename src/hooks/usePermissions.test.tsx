import type { AuthUser, Permission } from "@/contracts/api-contracts";
import { ALL_PERMISSIONS, MOCK_PROFILES } from "@/services/mock";
import { useAuthStore } from "@/store/auth.store";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { usePermissions } from "./usePermissions";

function loginAs(profileId: string): void {
  const profile = MOCK_PROFILES.find((p) => p.id === profileId);
  if (!profile) throw new Error(`Unknown profile ${profileId}`);
  const user: AuthUser = {
    sub: profile.claims.sub,
    preferred_username: profile.claims.preferred_username,
    email: profile.claims.email,
    authorities: profile.claims.authorities,
  };
  useAuthStore.setState({ user, isReady: true });
}

function logout(): void {
  useAuthStore.setState({ user: null, isReady: true });
}

beforeEach(() => {
  logout();
});

describe("usePermissions — unauthenticated", () => {
  it("returns false for any permission when no user is set", () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission("ticket:read")).toBe(false);
    expect(
      result.current.hasAnyPermission(["ticket:read", "document:read"]),
    ).toBe(false);
    expect(result.current.hasAllPermissions(["ticket:read"])).toBe(false);
    expect(result.current.authorities).toEqual([]);
  });
});

describe("usePermissions — admin profile", () => {
  beforeEach(() => loginAs("admin"));

  it("grants every spec scope", () => {
    const { result } = renderHook(() => usePermissions());

    const all: Permission[] = [...ALL_PERMISSIONS];
    for (const scope of all) {
      expect(result.current.hasPermission(scope)).toBe(true);
    }
    expect(result.current.hasAllPermissions(all)).toBe(true);
  });
});

describe("usePermissions — agent profile", () => {
  beforeEach(() => loginAs("agent"));

  it("can create and comment but cannot update tickets", () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission("ticket:create")).toBe(true);
    expect(result.current.hasPermission("ticket:comment")).toBe(true);
    expect(result.current.hasPermission("ticket:update")).toBe(false);
  });

  it("can manage documents fully", () => {
    const { result } = renderHook(() => usePermissions());
    expect(
      result.current.hasAllPermissions([
        "document:download",
        "document:read",
        "document:upload",
      ]),
    ).toBe(true);
  });
});

describe("usePermissions — user profile", () => {
  beforeEach(() => loginAs("user"));

  it("can read and comment on tickets but cannot create or update", () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission("ticket:read")).toBe(true);
    expect(result.current.hasPermission("ticket:comment")).toBe(true);
    expect(result.current.hasPermission("ticket:create")).toBe(false);
    expect(result.current.hasPermission("ticket:update")).toBe(false);
  });

  it('can read and download documents but cannot upload', () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission('document:read')).toBe(true);
    expect(result.current.hasPermission('document:download')).toBe(true);
    expect(result.current.hasPermission('document:upload')).toBe(false);
  });
});

describe('usePermissions — readonly profile', () => {
  beforeEach(() => loginAs('readonly'));

  it('has zero write permissions', () => {
    const { result } = renderHook(() => usePermissions());
    const writes: Permission[] = [
      'ticket:create',
      'ticket:update',
      'ticket:comment',
      'document:upload',
      'document:download',
    ];
    for (const scope of writes) {
      expect(result.current.hasPermission(scope)).toBe(false);
    }
  });

  it('still has read permissions', () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasAllPermissions(['ticket:read', 'document:read', 'notification:read'])).toBe(true);
  });
});

describe('usePermissions — predicate edge cases', () => {
  beforeEach(() => loginAs('user'));

  it('hasAnyPermission returns true if at least one matches', () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasAnyPermission(['ticket:create', 'ticket:read'])).toBe(true);
  });

  it('hasAnyPermission returns false on empty list', () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasAnyPermission([])).toBe(false);
  });

  it('hasAllPermissions returns true on empty list (vacuous truth)', () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasAllPermissions([])).toBe(true);
  });
});
