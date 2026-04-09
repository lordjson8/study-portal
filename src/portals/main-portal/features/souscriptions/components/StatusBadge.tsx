import type { TicketStatus } from "@/contracts/api-contracts";

const STYLES: Record<TicketStatus, { label: string; classes: string }> = {
  OPEN: { label: "Ouvert", classes: "bg-blue-50 text-blue-700" },
  IN_PROGRESS: { label: "En cours", classes: "bg-amber-50 text-amber-700" },
  RESOLVED: { label: "Résolu", classes: "bg-emerald-50 text-emerald-700" },
  CLOSED: { label: "Clôturé", classes: "bg-gray-100 text-gray-600" },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={` inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.classes}`}
    >
      {s.label}
    </span>
  );
}
