import type { AuthUser, JwtClaims } from "@/contracts/api-contracts";
import { decodeJwt } from "./jwt";
import { mockAuth } from "./mockAuth.service";
import { KeycloakAuth } from "./keycloak.service";

export interface AuthEngine {
  init(): Promise<void>;

  login(profileId?: string): Promise<void>;

  logout(): Promise<void>;

  getToken(): string | null;

  refresh(): Promise<string | null>;
}

const mode = (import.meta.env["VITE_AUTH_MODE"] ?? "mock") as
  | "mock"
  | "keycloak";
const engine: AuthEngine = mode === "keycloak" ? KeycloakAuth : mockAuth;

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
      return null;
    }

    return {
      sub: claims.sub,
      preferred_username: claims.preferred_username,
      email: claims.email,
      authorities: claims.authorities,
    };
  },
};
