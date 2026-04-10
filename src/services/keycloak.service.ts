import type { AuthEngine } from './auth.service';
import type Keycloak from 'keycloak-js';

let kc: Keycloak | null = null;
let initPromise: Promise<void> | null = null;

async function ensure(): Promise<Keycloak> {
  if (kc) return kc;
  const { default: KeycloakCtor } = await import('keycloak-js');
  kc = new KeycloakCtor({
    url: import.meta.env['VITE_KEYCLOAK_URL'] as string ?? 'http://localhost:8080',
    realm: import.meta.env['VITE_KEYCLOAK_REALM'] as string ?? 'boaz-study',
    clientId: import.meta.env['VITE_KEYCLOAK_CLIENT_ID'] as string ?? 'studyportal-app',
  });
  return kc;
}

/** Remove Keycloak callback params from the URL without triggering a reload. */
function cleanCallbackParams(): void {
  const url = new URL(window.location.href);
  const keycloakParams = ['code', 'state', 'session_state', 'iss'];
  let changed = false;
  keycloakParams.forEach((p) => {
    if (url.searchParams.has(p)) {
      url.searchParams.delete(p);
      changed = true;
    }
  });
  if (changed) {
    // replaceState: removes the params from the URL bar AND from history.
    // The user's back-button will now go to the page before /login, not
    // back to /?code=... which would confuse keycloak-js on the next init().
    window.history.replaceState({}, '', url.pathname + (url.search === '?' ? '' : url.search));
  }
}

export const keycloakAuth: AuthEngine = {
  async init(): Promise<void> {
    // If already in-flight, join it.
    if (initPromise) { await initPromise; return; }
    console.log(kc?.token)

    // If we already have a token, we're done.
    if (kc?.token) return;

    const k = await ensure();

    initPromise = (async () => {
      await k.init({
        // No onLoad — avoids check-sso passive redirect that causes
        // #error=login_required loop. Without onLoad, keycloak-js:
        //   - Detects ?code= in URL → exchanges for tokens (post-login case)
        //   - No ?code= → sets authenticated=false, does nothing else
        pkceMethod: 'S256',
        checkLoginIframe: false,
        responseMode: 'query',
      });

      // After init, if we got a token, clean the callback params from the URL.
      // This prevents:
      //   1. The URL bar showing /?code=abc&state=xyz&session_state=...
      //   2. The back button returning to that URL and re-triggering init()
      //      with a now-expired auth code (Keycloak codes are single-use)
      if (k.authenticated) {
        cleanCallbackParams();
      }
    })();

    try {
      await initPromise;
    } finally {
      initPromise = null;
    }
  },

  async login(): Promise<void> {
    if (initPromise) await initPromise;
    const k = await ensure();
    await k.login({
      redirectUri: window.location.origin + '/',
    });
  },

  async logout(): Promise<void> {
    const k = await ensure();
    initPromise = null;
    kc = null;
    await k.logout({
      redirectUri: window.location.origin + '/login',
    });
  },

  getToken(): string | null {
    return kc?.token ?? null;
  },

  async refresh(): Promise<string | null> {
    if (initPromise) await initPromise;
    const k = await ensure();
    try {
      await k.updateToken(30);
      return k.token ?? null;
    } catch {
      initPromise = null;
      kc = null;
      await k.login({ redirectUri: window.location.origin + '/' });
      return null;
    }
  },
};
