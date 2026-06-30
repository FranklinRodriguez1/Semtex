'use client';

import type { useDocuments } from './hooks/useTransfer';
import { formatFileSize } from './services/transfer';

interface ReceiveViewProps {
  docs: ReturnType<typeof useDocuments>;
}

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function ReceiveView({ docs }: ReceiveViewProps) {
  const { documents, loadingList, listError, refresh } = docs;

  return (
    <>
      {/* Scanline */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-[#F97316]/20 animate-scan shadow-[0_0_10px_#F97316]" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#F97316]">
            Mis documentos
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            DOCUMENTOS INGERIDOS DE MI EMPRESA
          </p>
        </div>
        <button
          onClick={() => void refresh()}
          className="text-[10px] uppercase tracking-[0.2em] text-[#F97316] border border-[#F97316]/40 px-3 py-1 transition-all duration-200 hover:bg-[#F97316]/10"
        >
          ↻ Refrescar
        </button>
      </div>

      {/* Documents panel */}
      <div className="border border-[#3a494b] bg-[#0e0e10]/30 mb-6">
        <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          Documentos ({documents.length})
        </div>
        <div className="divide-y divide-[#3a494b]/40">
          {loadingList ? (
            <div className="p-4 text-[10px] text-[#3a494b] italic">Cargando documentos…</div>
          ) : listError ? (
            <div className="p-4 text-[11px] text-[#EF4444]">{listError}</div>
          ) : documents.length === 0 ? (
            <div className="p-4 text-[10px] text-[#3a494b] italic">
              Aún no has subido documentos. Ve a &quot;Enviar&quot; para subir tu primer Excel/CSV.
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-4 py-3 transition-all duration-200 hover:bg-[#1a2d30]/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#E5E1E4] font-mono truncate">{doc.name}</p>
                  <p className="text-[9px] text-[#3a494b] mt-0.5">
                    {formatFileSize(doc.fileSizeBytes)} &middot; {formatTimestamp(doc.createdAt)}
                  </p>
                </div>
                <span className="ml-4 text-[9px] uppercase tracking-[0.15em] text-[#22C55E]">
                  ✓ Ingerido
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
