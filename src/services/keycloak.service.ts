import type Keycloak from "keycloak-js";
import type { AuthEngine } from "./auth.service";
// import { useAuthStore } from "@/store/auth.store";

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
    await k.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    });
    //  k.login()
    console.log("authenticated:", k.authenticated);
    console.log("token:", k.token);
    console.log("parsed token:", k.tokenParsed);

    // k.onAuthSuccess = () => {
    //   useAuthStore.getState().refreshUser();
    // };

    // k.onTokenExpired = () => {
    //   k.updateToken(30).catch(() => k.login());
    // };
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
