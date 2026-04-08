import type { Ticket } from "@/contracts/api-contracts";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "tk-1001",
    title: "Demandede financement — Master Informatique",
    description:
      "Je sollicite un financement pour ma deuxième année de master en informatique à Paris.",
    status: "OPEN",
    priority: "HIGH",
    createdAt: "2026-03-12T09:30:00.000Z",
    updatedAt: "2026-03-12T09:30:00.000Z",
    createdBy: "user-uuid-user",
    comments: [
      {
        id: "cm-1",
        ticketId: "tk-1001",
        authorSub: "user-uuid-agent",
        authorName: "Agent Boaz",
        body: "Bonjour, merci de joindre votre attestation de logement.",
        createdAt: "2026-03-12T10:15:00.000Z",
      },
    ],
  },
  {
    id: "tk-1002",
    title: "Remboursement partiel — Frais de scolarité",
    description:
      "Demande de remboursement partiel suite à un changement de programme en cours d’année.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: "2026-03-08T14:00:00.000Z",
    updatedAt: "2026-03-15T08:45:00.000Z",
    createdBy: "user-uuid-user",
    comments: [],
  },
  {
    id: "tk-1003",
    title: "Demande de financement — Bachelor Design",
    description: "Première demande pour un bachelor en design graphique.",
    status: "RESOLVED",
    priority: "LOW",
    createdAt: "2026-02-20T11:20:00.000Z",
    updatedAt: "2026-03-01T16:00:00.000Z",
    createdBy: "user-uuid-admin",
    comments: [
      {
        id: "cm-2",
        ticketId: "tk-1003",
        authorSub: "user-uuid-admin",
        authorName: "Admin Boaz",
        body: "Dossier validé, virement programmé.",
        createdAt: "2026-03-01T16:00:00.000Z",
      },
    ],
  },
  {
    id: "tk-1004",
    title: "Renouvellement de bourse",
    description:
      "Renouvellement annuel de la bourse Boaz pour la rentrée 2026.",
    status: "CLOSED",
    priority: "MEDIUM",
    createdAt: "2025-11-05T08:00:00.000Z",
    updatedAt: "2025-12-10T17:30:00.000Z",
    createdBy: "user-uuid-user",
    comments: [],
  },
];
