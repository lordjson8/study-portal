import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_PROFILES } from '@/services/mock/auth.mock';
import { authService } from '@/services/auth.service';

export default function LoginPage() {
  const { login, isReady } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Mock mode: pick a profile → forge JWT → navigate to dashboard
  async function handleMockPick(profileId: string) {
    setPendingId(profileId);
    setPending(true);
    try {
      await login(profileId);
      navigate('/', { replace: true });
    } finally {
      setPending(false);
      setPendingId(null);
    }
  }

  // Keycloak mode: k.login() redirects the whole browser — never returns
  async function handleKeycloakLogin() {
    setPending(true);
    await login();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-blue-soft via-white to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="flex justify-center pb-6">
          <Logo />
        </div>

        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Bienvenue
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          {authService.mode === 'mock'
            ? 'Choisissez un profil pour vous connecter (mode démo)'
            : 'Authentifiez-vous via le portail BOAZ-STUDY'}
        </p>

        {authService.mode === 'mock' && (
          <>
            <div className="mt-6 flex flex-col gap-3">
              {MOCK_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => void handleMockPick(p.id)}
                  disabled={pending}
                  className="group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-brand-blue hover:bg-brand-blue-soft disabled:opacity-50"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-brand-blue">
                      {p.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.claims.authorities.length} permission
                      {p.claims.authorities.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className="text-brand-orange">
                    {pendingId === p.id ? '…' : '→'}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-gray-400">
              Le mode démo ne valide aucun mot de passe — la sélection du profil
              détermine les permissions de l'interface.
            </p>
          </>
        )}

        {authService.mode === 'keycloak' && (
          <>
            <div className="mt-8">
              <button
                onClick={() => void handleKeycloakLogin()}
                disabled={pending || !isReady}
                className="w-full rounded-xl bg-brand-blue px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
              >
                {!isReady ? 'Initialisation…' : pending ? 'Redirection…' : 'Se connecter avec Keycloak'}
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Comptes disponibles
              </p>
              <table className="w-full text-xs text-gray-600">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-1 text-left font-medium">Login</th>
                    <th className="pb-1 text-left font-medium">Mot de passe</th>
                    <th className="pb-1 text-left font-medium">Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { login: 'admin.boaz',    pass: 'admin123',    role: 'Admin (tout)' },
                    { login: 'agent.boaz',    pass: 'agent123',    role: 'Agent' },
                    { login: 'user.boaz',     pass: 'user123',     role: 'Utilisateur' },
                    { login: 'readonly.boaz', pass: 'readonly123', role: 'Lecture seule' },
                  ].map((u) => (
                    <tr key={u.login}>
                      <td className="py-1 font-mono">{u.login}</td>
                      <td className="py-1 font-mono">{u.pass}</td>
                      <td className="py-1">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Keycloak doit être démarré sur{' '}
              <code className="rounded bg-gray-100 px-1">localhost:8082</code>.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
