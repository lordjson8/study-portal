import type { AppNotification } from "@/contracts/api-contracts";

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-1",
    level: "INFO",
    title: "Nouveau commentaire",
    body: "Un agent a commenté votre demande tk-1001.",
    read: false,
    createdAt: "2026-03-12T10:15:00.000Z",
  },
  {
    id: "n-2",
    level: "SUCCESS",
    title: "Virement effectué",
    body: "Le virement pour la demande tk-1003 a été émis.",
    read: false,
    createdAt: "2026-03-01T16:05:00.000Z",
  },
  {
    id: "n-3",
    level: "WARNING",
    title: "Document manquant",
    body: "Merci de joindre votre attestation de logement.",
    read: true,
    createdAt: "2026-02-25T08:00:00.000Z",
  },
];
