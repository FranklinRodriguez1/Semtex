'use client';

import { useState } from 'react';

interface ReceiveViewProps {
  files?: File[];
  onAction?: (action: string, data?: unknown) => void;
}

interface AvailableDocument {
  id: string;
  filename: string;
  sender: string;
  size: string;
  timestamp: string;
  status: 'available' | 'downloading' | 'downloaded';
}

const MOCK_DOCUMENTS: AvailableDocument[] = [
  { id: '1', filename: 'REPORTE_Q1_2026.xlsx', sender: 'ANALYST@SECTOR7', size: '2.4 MB', timestamp: new Date().toISOString(), status: 'available' },
  { id: '2', filename: 'ORDEN_OPERATIVA_42.pdf', sender: 'COMANDO@CENTRAL', size: '1.1 MB', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'available' },
  { id: '3', filename: 'MANIFIESTO_CARGA.zip', sender: 'LOGISTICA@SECTOR3', size: '14.7 MB', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'downloaded' },
];

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function ReceiveView(_props: ReceiveViewProps) {
  const [documents] = useState<AvailableDocument[]>(MOCK_DOCUMENTS);

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
            Receive Inbox Protocol
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            SECURE_P2P_INBOX_V2.0
          </p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] font-mono">
          <p>AES-256-GCM / RSA-4096</p>
        </div>
      </div>

      {/* Available documents panel */}
      <div className="border border-[#3a494b] bg-[#0e0e10]/30 mb-6">
        <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          Documentos Disponibles
        </div>
        <div className="divide-y divide-[#3a494b]/40">
          {documents.length === 0 ? (
            <div className="p-4 text-[10px] text-[#3a494b] italic">
              No hay documentos disponibles para descarga...
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-4 py-3 transition-all duration-200 hover:bg-[#1a2d30]/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#E5E1E4] font-mono truncate">{doc.filename}</p>
                  <p className="text-[9px] text-[#3a494b] mt-0.5">
                    {doc.sender} &middot; {doc.size} &middot; {formatTimestamp(doc.timestamp)}
                  </p>
                </div>
                <div className="ml-4 flex">
                  {doc.status === 'available' && (
                    <button className="text-[10px] uppercase tracking-[0.15em] text-[#F97316] border border-[#F97316]/40 px-3 py-1 transition-all duration-200 hover:bg-[#F97316]/10 hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                      DESCARGAR
                    </button>
                  )}
                  {doc.status === 'downloading' && (
                    <span className="text-[10px] text-[#F97316] italic">Descargando...</span>
                  )}
                  {doc.status === 'downloaded' && (
                    <span className="text-[10px] text-[#22C55E]">✓ Descargado</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Auxiliary Info */}
      <div className="border border-[#3a494b] bg-[#0e0e10]/30 p-4">
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#3a494b] mb-2">Decryption Status</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
          <span className="text-[10px] text-[#b9cacb]">Clave de descifrado activa — canal seguro establecido</span>
        </div>
      </div>
    </>
  );
}
