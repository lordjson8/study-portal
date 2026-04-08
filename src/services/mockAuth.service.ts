import type { AuthEngine } from "./auth.service";
import { forgeMockJwt } from "./jwt";
import { getMockProfile, MOCK_PROFILES } from "./mock/auth.mock";

const STORAGE_KEY = "studyportal:mockAuth:profileId";

const DEFAULT_PROFILE_ID = "user";

let currentToken: string | null = null;

function loadProfile(id: string): void {
  const profile = getMockProfile(id);
  currentToken = forgeMockJwt(profile.claims);
  localStorage.setItem(STORAGE_KEY, id);
}

export const mockAuth: AuthEngine = {
  async init(): Promise<void> {
    const stored = localStorage.getItem(STORAGE_KEY);
    const id =
      stored && MOCK_PROFILES.some((p) => p.id === stored)
        ? stored
        : DEFAULT_PROFILE_ID;
    loadProfile(id);
  },

  async login(profileId?: string): Promise<void> {
    loadProfile(profileId ?? DEFAULT_PROFILE_ID);
  },

  async logout(): Promise<void> {
    currentToken = null;
    localStorage.removeItem(STORAGE_KEY);
  },

  getToken(): string | null {
    return currentToken;
  },

  async refresh(): Promise<string | null> {
    return currentToken;
  },
};
