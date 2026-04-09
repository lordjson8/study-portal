import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { MOCK_PROFILES } from "@/services/mock";
import { Users } from "lucide-react";
import { useState } from "react";

export function DevProfileSwitcher() {
  const { user, login } = useAuth();
  const [open, setOpen] = useState(false);

  if (authService.mode !== "mock") return null;
  const currentProfile = MOCK_PROFILES.find((p) => p.claims.sub === user?.sub);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 w-72 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl">
          <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Profil démo (mock)
          </div>
          <div className="flex flex-col gap-1">
            {MOCK_PROFILES.map((p) => {
              const isCurrent = p.claims.sub === user?.sub;
              return (
                <button
                  key={p.id}
                  onClick={async () => {
                    await login(p.id);
                    setOpen(false);
                  }}
                  className={`flex items-start justify-between rounded-lg px-3 py-2 text-left border border-white text-sm transition ${isCurrent ? "bg-brand-blue-soft text-brand-blue" : "hover:bg-gray-50 hover:border-gray-200 "}`}
                >
                  <div>
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-gray-500">
                      {p.claims.authorities.length} permission
                      {p.claims.authorities.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {isCurrent && <span className="text-xs">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-brand-blue px-4 py-3 text-sm font-medium text-white shadow-lg hover:brightness-110"
        aria-label="Changer de profil démo"
      >
        <Users className="h-4 w-4" />
        {currentProfile?.label ?? "Profil"}
      </button>
    </div>
  );
}
