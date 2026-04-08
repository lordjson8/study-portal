import type Keycloak from "keycloak-js";
import type { AuthEngine } from "./auth.service";

let kc: Keycloak | null = null;

async function ensure(): Promise<Keycloak> {
  if (kc) return kc;

  const { default: KeycloakCtor } = await import("keycloak-js");
  kc = new KeycloakCtor({
    url: import.meta.env["VITE_KEYCLOAK_URL"] ?? "",
    realm: import.meta.env["VITE_KEYCLOAK_REALM"] ?? "",
    clientId: import.meta.env["VITE_KEYCLOAK_CLIENT_ID"] ?? "",
  });

  return kc;
}

export const KeycloakAuth: AuthEngine = {
  async init(): Promise<void> {
    const k = await ensure();
    await k.init({ onLoad: "check-sso", pkceMethod: "S256" });
  },

  async login(): Promise<void> {
    const k = await ensure();

    k.login();
  },

  async logout(): Promise<void> {
    const k = await ensure();

    k.logout();
  },

  getToken(): string | null {
    return kc?.token ?? null;
  },

  async refresh(): Promise<string | null> {
    const k = await ensure();

    try {
      await k.updateToken(30);
      return k.token ?? null;
    } catch {
      await k.login();
      return null;
    }
  },
};
