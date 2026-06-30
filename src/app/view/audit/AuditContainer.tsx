'use client';

import { useEffect, useState } from 'react';
import { getAuditLogs, type AuditLog, type AuditAction } from './services/audit';

const ACTION_LABELS: Record<AuditAction, { label: string; color: string }> = {
  DOCUMENT_UPLOADED: { label: 'Documento subido',    color: '#00E5FF' },
  FINANCIAL_QUERY:   { label: 'Consulta financiera', color: '#74f5ff' },
  EMAIL_SENT:        { label: 'Correo enviado',       color: '#22C55E' },
  EMAIL_FAILED:      { label: 'Correo fallido',       color: '#EF4444' },
  USER_LOGIN:        { label: 'Login',                color: '#b9cacb' },
  USER_CREATED:      { label: 'Usuario creado',       color: '#F97316' },
  USER_DEACTIVATED:  { label: 'Usuario desactivado',  color: '#EF4444' },
  ROLE_CHANGED:      { label: 'Rol cambiado',         color: '#F97316' },
};

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  } catch { return ts; }
}

export function AuditContainer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    getAuditLogs(200)
      .then(setLogs)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-full bg-[#000000] p-8 text-[#E5E1E4]">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
          <div>
            <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#F97316]">
              Registro de auditoría
            </h1>
            <p className="mt-1 text-[10px] tracking-[0.15em] text-[#3a494b]">
              HISTORIAL DE ACCIONES DEL SISTEMA
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="text-[10px] uppercase tracking-[0.2em] text-[#F97316] border border-[#F97316]/40 px-3 py-1 transition-all duration-200 hover:bg-[#F97316]/10"
          >
            ↻ Refrescar
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 overflow-hidden">

          {loading && (
            <div className="p-6 text-[10px] italic text-[#3a494b]">Cargando logs…</div>
          )}

          {error && (
            <div className="p-6 text-[11px] text-[#EF4444]">{error}</div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="p-6 text-[10px] italic text-[#3a494b]">
              Sin acciones registradas todavía.
            </div>
          )}

          {!loading && logs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[#3a494b] text-[9px] uppercase tracking-[0.2em] text-[#3a494b]">
                    <th className="px-4 py-3 text-left font-normal">Acción</th>
                    <th className="px-4 py-3 text-left font-normal">Descripción</th>
                    <th className="px-4 py-3 text-left font-normal whitespace-nowrap">Realizado por</th>
                    <th className="px-4 py-3 text-left font-normal whitespace-nowrap">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: '#b9cacb' };
                    return (
                      <tr key={log.id} className="border-b border-[#3a494b]/40 hover:bg-[#1a2d30]/20 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-block rounded px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] font-semibold"
                            style={{ color: meta.color, backgroundColor: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#b9cacb] max-w-xs truncate" title={log.description}>
                          {log.description}
                        </td>
                        <td className="px-4 py-3 font-mono text-[#3a494b] text-[9px] whitespace-nowrap">
                          {log.performedBy.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-3 text-[#3a494b] text-[10px] whitespace-nowrap">
                          {formatTimestamp(log.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="px-4 py-2 text-[9px] text-[#3a494b]">
                {logs.length} entrada{logs.length !== 1 ? 's' : ''} · últimas 200
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
