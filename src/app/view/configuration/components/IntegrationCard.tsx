'use client';

import type { Integration } from '../types';

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (id: string, enabled: boolean) => void;
  disabled?: boolean;
}

const TYPE_LABELS: Record<Integration['type'], string> = {
  api: 'API',
  webhook: 'WEBHOOK',
  database: 'DATABASE',
  auth: 'AUTH',
};

const STATUS_CONFIG: Record<Integration['status'], { label: string; dot: string; border: string }> = {
  active: { label: 'ACTIVO', dot: 'bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.5)]', border: 'border-[#22C55E]/30' },
  inactive: { label: 'INACTIVO', dot: 'bg-[#3a494b]', border: 'border-[#3a494b]' },
  error: { label: 'ERROR', dot: 'bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.5)]', border: 'border-[#EF4444]/30' },
};

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

export function IntegrationCard({ integration, onToggle, disabled }: IntegrationCardProps) {
  const isActive = integration.status === 'active';
  const config = STATUS_CONFIG[integration.status];

  return (
    <div className={`border ${config.border} bg-[#0e0e10]/30 transition-all duration-200 hover:bg-[#1a2d30]/20`}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`h-2 w-2 rounded-full ${config.dot}`} />
              <span className="text-[11px] font-mono text-[#3a494b] uppercase tracking-[0.15em]">
                {TYPE_LABELS[integration.type]}
              </span>
            </div>
            <h3 className="text-[13px] text-[#E5E1E4] font-mono truncate">
              {integration.name}
            </h3>
            <p className="text-[10px] text-[#b9cacb] mt-0.5 leading-relaxed">
              {integration.description}
            </p>
            <p className="text-[9px] text-[#3a494b] mt-1.5 font-mono">
              Última sincronización: {formatTimestamp(integration.lastSync)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-[9px] uppercase tracking-[0.15em] ${config.dot ? 'text-[#22C55E]' : config.label === 'ERROR' ? 'text-[#EF4444]' : 'text-[#3a494b]'}`}>
              {config.label}
            </span>
            <button
              type="button"
              onClick={() => onToggle(integration.id, !isActive)}
              disabled={disabled}
              className={`
                relative w-10 h-5 rounded-full transition-all duration-300
                ${isActive ? 'bg-[#22C55E]' : 'bg-[#3a494b]/50'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm
                  ${isActive ? 'left-[22px]' : 'left-[2px]'}
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
