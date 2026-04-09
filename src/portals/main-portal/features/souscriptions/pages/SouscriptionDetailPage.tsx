import { type Ticket } from "@/contracts/api-contracts";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getTicket } from "../api";
import { ChevronLeft, Pencil } from "lucide-react";
import { ProtectedComponent } from "@/components/ProtectedComponent";
import { StatusBadge } from "../components/StatusBadge";

export function SouscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    getTicket(id)
      .then((t) => {
        if (!cancelled) setTicket(t);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 text-sm rounded-lg">
        {error}
      </div>
    );
  }
  if (!ticket) {
    return <div className="text-sm text-gray-400">Chargement…</div>;
  }
  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/souscriptions"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {ticket.title}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            <span className="text-xs text-gray-500">
              Priorité {ticket.priority}
            </span>
          </div>
        </div>
        <ProtectedComponent permission="ticket:update">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
            <Pencil className="h-4 w-4" />
            Modifier le statut
          </button>
        </ProtectedComponent>
      </div>

      <p className="whitespace-pre-line text-sm text-gray-700">
        {ticket.description}
      </p>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Commentaires ({ticket.comments.length})
        </h3>
        <div className="flex flex-col gap-2">
          {ticket.comments.map((c) => (
            <div key={c.id} className="rounded-xl bg-gray-50 p-3 text-sm">
              <div className="font-medium text-gray-800">{c.authorName}</div>
              <div className="text-gray-600">{c.body}</div>
            </div>
          ))}
          {ticket.comments.length === 0 && (
            <div className="text-xs text-gray-400">
              Aucun commentaire pour le moment.
            </div>
          )}

          <ProtectedComponent permission="ticket:comment">
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // Optimistic local-only addition (no backend route in mock).
                if (!comment.trim()) return;
                setTicket((prev) =>
                  prev
                    ? {
                        ...prev,
                        comments: [
                          ...prev.comments,
                          {
                            id: `cm-local-${Date.now()}`,
                            ticketId: prev.id,
                            authorSub: "me",
                            authorName: "Moi",
                            body: comment.trim(),
                            createdAt: new Date().toISOString(),
                          },
                        ],
                      }
                    : prev,
                );
                setComment("");
              }}
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire…"
                className="min-h-20px w-full resize-y rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-blue focus:outline-none"
              />
              <button
                type="submit"
                className="self-end rounded-xl bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:brightness-110"
              >
                Publier
              </button>
            </form>
          </ProtectedComponent>
        </div>
      </section>
    </div>
  );
}
