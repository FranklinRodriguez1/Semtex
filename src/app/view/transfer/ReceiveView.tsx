'use client';

import { useState } from 'react';
import type { useDocuments } from './hooks/useTransfer';
import { useFinancialRecords } from './hooks/useFinancialRecords';
import { formatFileSize } from './services/transfer';

interface ReceiveViewProps {
  docs: ReturnType<typeof useDocuments>;
}

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  } catch { return ts; }
}

function RecordsPanel({ documentId, documentName }: { documentId: string; documentName: string }) {
  const { records, loading, error } = useFinancialRecords(documentId);

  const columns: string[] = records.length > 0
    ? Object.keys(records[0].rowData)
    : [];

  return (
    <div className="border-t border-[#F97316]/20 bg-[#0a0f10]">
      <div className="px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-[#F97316]/60">
        Registros · {documentName}
      </div>

      {loading && (
        <div className="px-4 py-3 text-[10px] italic text-[#3a494b]">Cargando registros…</div>
      )}

      {error && (
        <div className="px-4 py-3 text-[11px] text-[#EF4444]">{error}</div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="px-4 py-3 text-[10px] italic text-[#3a494b]">
          Sin registros ingeridos para este documento.
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead className="sticky top-0 bg-[#0e0e10] z-10">
              <tr>
                <th className="px-3 py-2 text-left font-normal text-[#3a494b] border-b border-[#3a494b]/40 whitespace-nowrap">#</th>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-normal text-[#b9cacb] border-b border-[#3a494b]/40 whitespace-nowrap uppercase tracking-[0.1em]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="border-b border-[#3a494b]/20 hover:bg-[#1a2d30]/20 transition-colors">
                  <td className="px-3 py-1.5 text-[#3a494b] font-mono">{rec.rowIndex}</td>
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-1.5 text-[#E5E1E4] font-mono whitespace-nowrap">
                      {rec.rowData[col] !== null && rec.rowData[col] !== undefined
                        ? String(rec.rowData[col])
                        : <span className="text-[#3a494b]">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-1.5 text-[9px] text-[#3a494b]">
            {records.length} registro{records.length !== 1 ? 's' : ''} · máx. 500 mostrados
          </p>
        </div>
      )}
    </div>
  );
}

export function ReceiveView({ docs }: ReceiveViewProps) {
  const { documents, loadingList, listError, refresh } = docs;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

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
            DOCUMENTOS INGERIDOS DE MI EMPRESA · CLIC PARA VER REGISTROS
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

        {loadingList ? (
          <div className="p-4 text-[10px] text-[#3a494b] italic">Cargando documentos…</div>
        ) : listError ? (
          <div className="p-4 text-[11px] text-[#EF4444]">{listError}</div>
        ) : documents.length === 0 ? (
          <div className="p-4 text-[10px] text-[#3a494b] italic">
            Aún no has subido documentos. Ve a &quot;Enviar&quot; para subir tu primer Excel/CSV.
          </div>
        ) : (
          <div className="divide-y divide-[#3a494b]/40">
            {documents.map((doc) => {
              const isOpen = expandedId === doc.id;
              return (
                <div key={doc.id}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(doc.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 hover:bg-[#1a2d30]/30"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#E5E1E4] font-mono truncate">{doc.name}</p>
                      <p className="text-[9px] text-[#3a494b] mt-0.5">
                        {formatFileSize(doc.fileSizeBytes)} · {formatTimestamp(doc.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-[#22C55E]">
                        ✓ Ingerido
                      </span>
                      <span className={`text-[#F97316]/60 text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <RecordsPanel documentId={doc.id} documentName={doc.name} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
