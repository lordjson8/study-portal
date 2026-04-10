import { useEffect, useState } from "react";
import { listDocuments } from "../api";
import type { DocumentItem } from "@/contracts/api-contracts";
import { ProtectedComponent } from "@/components/ProtectedComponent";
import { Download, FileText, Upload } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function DocumentsListPage() {
  const [docs, setDocs] = useState<DocumentItem[] | null>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listDocuments()
      .then((d) => {
        if (!cancelled) setDocs(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleDownload(doc: DocumentItem) {
    const blob = new Blob([`Mock content for ${doc.name}`], {
      type: doc.mimeType,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Mes attestations
          </h2>
          <p className="text-sm text-gray-500">
            Vos justificatifs et documents officiels.
          </p>
        </div>
        <ProtectedComponent permission="document:upload">
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:brightness-110">
            <Upload className="h-4 w-4" />
            Joindre un fichier
          </button>
        </ProtectedComponent>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {docs === null && !error && (
        <div className="text-sm text-gray-400">Chargement…</div>
      )}
      {docs && docs.length > 0 && (
        <div className="grid max-[760px]:grid-cols-1 gap-3 grid-cols-3   max-[1240px]:grid-cols-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-soft text-brand-blue">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className=" text-sm font-medium text-gray-900">
                    {doc.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBytes(doc.size)} ·{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
              <ProtectedComponent permission="document:download">
                <button
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </button>
              </ProtectedComponent>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
