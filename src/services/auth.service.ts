import type { AuthUser, JwtClaims } from "@/contracts/api-contracts";
import { decodeJwt } from "./jwt";
import { mockAuth } from "./mockAuth.service";
import { keycloakAuth } from "./keycloak.service";

export interface AuthEngine {
  init(): Promise<void>;
  login(profileId?: string): Promise<void>;
  logout(): Promise<void>;
  getToken(): string | null;
  refresh(): Promise<string | null>;
}

const mode = (import.meta.env["VITE_AUTH_MODE"] ?? "mock") as "mock" | "keycloak";
const engine: AuthEngine = mode === "keycloak" ? keycloakAuth : mockAuth;

export const authService = {
  mode,
  init: () => engine.init(),
  login: (profileId?: string) => engine.login(profileId),
  logout: () => engine.logout(),
  getToken: () => engine.getToken(),
  refresh: () => engine.refresh(),

  getCurrentUser(): AuthUser | null {
    const token = engine.getToken();
    if (!token) return null;

    let claims: JwtClaims;
    try {
      claims = decodeJwt(token);
    } catch {
      console.error('[auth] Failed to decode token');
      return null;
    }

    // Defensive: authorities may be missing or empty on some Keycloak configs.
    // Cast through unknown to handle the case where the mapper isn't set up yet.
    const rawAuthorities = (claims as unknown as Record<string, unknown>)['authorities'];
    const authorities = Array.isArray(rawAuthorities) ? rawAuthorities : [];

    if (authorities.length === 0) {
      console.warn(
        '[auth] Token has no authorities[]. ' +
        'Check the authorities-mapper is configured in Keycloak ' +
        '(Clients → studyportal-app → Client scopes → authorities-mapper, type=String, multivalued=ON).'
      );
    }

    return {
      sub: claims.sub,
      preferred_username: claims.preferred_username,
      email: claims.email,
      // Use the raw array — it may contain strings that aren't in the Permission
      // union yet (e.g. future scopes). The Permission type is for compile-time
      // safety, the cast is safe at runtime because we validate via hasPermission.
      authorities: authorities as AuthUser['authorities'],
    };
  },
};
