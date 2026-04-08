import { ProtectedComponent } from "./ProtectedComponent";
import type { AuthUser } from "@/contracts/api-contracts";
import { MOCK_PROFILES } from "@/services/mock";
import { useAuthStore } from "@/store/auth.store";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

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

beforeEach(() => {
  useAuthStore.setState({ user: null, isReady: true });
});

describe("<ProtectedComponent>", () => {
  it("renders children when the user has the required single permission", () => {
    loginAs("admin");

    render(
      <ProtectedComponent permission="ticket:create">
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );

    expect(
      screen.getByRole("button", { name: /créer un ticket/i }),
    ).toBeInTheDocument();
  });

  it("renders NOTHING when the user lacks the permission (no error placeholder)", () => {
    loginAs("readonly");

    render(
      <ProtectedComponent permission="ticket:create">
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText(/permission/i)).toBeNull();
    expect(screen.queryByText(/forbidden/i)).toBeNull();
  });

  it("honors the optional `fallback` prop when provided", () => {
    loginAs("readonly");

    render(
      <ProtectedComponent
        permission="ticket:create"
        fallback={<span>Demandez un upgrade</span>}
      >
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(/demandez un upgrade/i)).toBeInTheDocument();
  });

  it("anyOf renders when at least one permission is granted", () => {
    loginAs("user");

    render(
      <ProtectedComponent anyOf={["ticket:create", "ticket:read"]}>
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );

    expect(
      screen.getByRole("button", { name: /créer un ticket/i }),
    ).toBeInTheDocument();
  });

  it("allOf hides when one permission is missing", () => {
    loginAs("user");

    render(
      <ProtectedComponent allOf={["ticket:update", "ticket:read"]}>
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("hides everything for unauthenticated users", () => {
    useAuthStore.setState({ user: null, isReady: true });

    render(
      <ProtectedComponent permission="ticket:read">
        <div>liste des tickets</div>
      </ProtectedComponent>,
    );
    expect(screen.queryByText(/liste des tickets/i)).toBeNull();
  });
});
