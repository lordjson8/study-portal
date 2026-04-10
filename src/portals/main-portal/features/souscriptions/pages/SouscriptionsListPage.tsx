import { ProtectedComponent } from "@/components/ProtectedComponent";
import type { Ticket } from "@/contracts/api-contracts";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listTickets } from "../api";
import { StatusBadge } from "../components/StatusBadge";

export function SouscriptionsListPage() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTickets()
      .then((data) => setTickets(data))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      });
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mes demandes</h2>
          <p className="text-sm text-gray-500">
            Suivez l’avancement de vos demandes de financement.
          </p>
        </div>
        <ProtectedComponent permission="ticket:create">
          <Link
            to={"/souscriptions/nouvelle"}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange text-white px-4 py-2 font-medium hover:brightness-110"
          >
            <Plus className="w-4 h-4" />
            Créer une demande
          </Link>
        </ProtectedComponent>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {tickets === null && !error && (
        <div className="text-gray-400 text-sm">Chargement…</div>
      )}

      {tickets && tickets.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Aucune demande pour le moment.
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-sm 00">Titre</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Priorité</th>
                <th className="px-4 py-3">Créée le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {tickets.map((t) => (
                <tr className="" key={t.id}>
                  <td className="px-4 py-3">
                    <Link
                      to={`/souscriptions/${t.id}`}
                      className="font-medium text-brand-blue hover:underline"
                    >
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.priority}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
