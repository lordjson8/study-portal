import type { DocumentItem } from "@/contracts/api-contracts";

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Attestation_de_logement.pdf",
    kind: "ATTESTATION_LOGEMENT",

    mimeType: "application/pdf",
    size: 184_320,
    uploadedAt: "2026-03-10T08:00:00.000Z",
    uploadedBy: "user-uuid-user",
    downloadUrl: "/mock/documents/doc-1.pdf",
  },
  {
    id: "doc-1",
    name: "Attestation_de_logement.pdf",
    kind: "ATTESTATION_LOGEMENT",

    mimeType: "application/pdf",
    size: 284_320,
    uploadedAt: "2026-03-10T08:00:00.000Z",
    uploadedBy: "user-uuid-user",
    downloadUrl: "/mock/documents/doc-1.pdf",
  },
  {
    id: "doc-2",
    name: "Attestation_de_logement.pdf",
    kind: "ATTESTATION_LOGEMENT",

    mimeType: "application/pdf",
    size: 184_320,
    uploadedAt: "2026-03-09T09:30:00.000Z",
    uploadedBy: "user-uuid-user",
    downloadUrl: "/mock/documents/doc-2.pdf",
  },
  {
    id: "doc-3",
    name: "Attestation_virement_irrevocable.pdf",
    kind: "ATTESTATION_VIREMENT",

    mimeType: "application/pdf",
    size: 96_000,
    uploadedAt: "2026-03-11T15:20:00.000Z",
    uploadedBy: "user-uuid-admin",
    downloadUrl: "/mock/documents/doc-3.pdf",
  },
  {
    id: "doc-4",
    name: "justificatif_revenue_2025.pdf",
    kind: "JUSTIFICATIF",

    mimeType: "application/pdf",
    size: 245_000,
    uploadedAt: "2026-02-28T09:00:00.000Z",
    uploadedBy: "user-uuid-user",
    downloadUrl: "/mock/documents/doc-4.pdf",
  },
];
