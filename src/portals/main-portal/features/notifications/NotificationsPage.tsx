import { useEffect, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { apiClient } from "@/services/api.service";
import type {
  ApiResponse,
  AppNotification,
  NotificationLevel,
} from "@/contracts/api-contracts";

const ICONS: Record<
  NotificationLevel,
  React.ComponentType<{ className?: string }>
> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  ERROR: XCircle,
};
const COLORS: Record<NotificationLevel, string> = {
  INFO: "text-blue-600 bg-blue-50",
  SUCCESS: "text-emerald-600 bg-emerald-50",
  WARNING: "text-amber-600 bg-amber-50",
  ERROR: "text-red-600 bg-red-50",
};

export function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<ApiResponse<AppNotification[]>>("/notifications")
      .then((r) => !cancelled && setItems(r.data.data))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand-blue" />
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
      </div>

      {items === null && (
        <div className="text-sm text-gray-400">Chargement…</div>
      )}
      {items && items.length === 0 && (
        <div className="text-sm text-gray-500">Aucune notification.</div>
      )}

      <ul className="flex flex-col gap-2">
        {items?.map((n) => {
          const Icon = ICONS[n.level];
          return (
            <li
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 ${
                n.read ? "opacity-70" : ""
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${COLORS[n.level]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span
                      className="h-2 w-2 rounded-full bg-brand-orange"
                      aria-label="Non lu"
                    />
                  )}
                </div>
                <div className="text-sm text-gray-600">{n.body}</div>
                <div className="mt-1 text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString("fr-FR")}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
