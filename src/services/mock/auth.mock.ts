import type {
  JwtClaims,
  MockUserProfile,
  Permission,
} from "@/contracts/api-contracts";

export const ALL_PERMISSIONS: readonly Permission[] = [
  "ticket:create",
  "ticket:read",
  "ticket:update",
  "ticket:comment",
  "document:upload",
  "document:read",
  "document:download",
  "notification:read",
] as const;

function makeClaims(args: {
  sub: string;
  username: string;
  email: string;
  realmRoles: string[];
  authorities: Permission[];
}): JwtClaims {
  return {
    sub: args.sub,
    preferred_username: args.username,
    email: args.email,
    realm_access: { roles: args.realmRoles },
    resource_access: {
      "studyportal-app": { roles: args.realmRoles },
    },
    scope: "openid profile",
    authorities: args.authorities,

    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  };
}

export const MOCK_PROFILES: MockUserProfile[] = [
  {
    id: "admin",
    label: "Admin (toutes permission)",
    claims: makeClaims({
      sub: "uer-uuid-admin",
      username: "admin.boaz",
      email: "admin@boaz-study.com",
      realmRoles: ["ADMIN", "AGENT", "USER"],
      authorities: [...ALL_PERMISSIONS],
    }),
  },
  {
    id: "agent",
    label: "Agent (gestion sansmodification de statut)",
    claims: makeClaims({
      sub: "user-uuid-agent",
      username: "agent.boaz",
      email: "agent@boaz-study.com",
      realmRoles: ["AGENT", "USER"],
      authorities: [
        "ticket:create",
        "ticket:read",
        "ticket:comment",
        "document:upload",
        "document:read",
        "document:download",
        "notification:read",
      ],
    }),
  },
  {
    id: "user",
    label: "Utilisateur standard",
    claims: makeClaims({
      sub: "user-uuid-user",
      username: "json8.clinet",
      email: "lordjson8@gmail.com",
      realmRoles: ["USER"],

      authorities: [
        "ticket:read",
        "ticket:comment",
        "document:read",
        "document:download",
        "notification:read",
      ],
    }),
  },
  {
    id: "readonly",
    label: "Lecture seule (audit)",
    claims: makeClaims({
      sub: "user-uuid-readonly",
      username: "audit.boaz",
      email: "audit@boaz-study.com",
      realmRoles: ["USER"],

      authorities: ["ticket:read", "document:read", "notification:read"],
    }),
  },
];

export function getMockProfile(id: string): MockUserProfile {
  const profile = MOCK_PROFILES.find((profile) => profile.id === id);

  if (!profile) {
    throw new Error(`[auth.mock] Unknown profile id: "${id}"`);
  }
  return profile;
}
