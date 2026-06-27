'use client';

import { useEffect } from 'react';
import { useConfiguration } from './hooks/useConfiguration';
import { IntegrationCard } from './components/IntegrationCard';

interface IntegrationsViewProps {
  onAction?: (action: string, data?: unknown) => void;
}

export function IntegrationsView(_props: IntegrationsViewProps) {
  const { state, load, toggle, dismissError } = useConfiguration();

  useEffect(() => {
    if (state.loading === 'idle') load();
  }, [state.loading, load]);

  return (
    <>
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-[#00E5FF]/20 animate-scan shadow-[0_0_10px_#00E5FF]" />
      </div>

      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#00E5FF]">
            Configuration Protocol
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            SYSTEM_INTEGRATION_LAYER
          </p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] font-mono">
          <p>REST-API / WEBHOOK / BRIDGE</p>
        </div>
      </div>

      {state.error && (
        <div className="mb-4 animate-slide-up flex items-center justify-between bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-2 text-[11px] text-[#EF4444]">
          <span className="tracking-[0.05em]">ERROR: {state.error}</span>
          <button
            onClick={dismissError}
            className="text-[#EF4444]/60 hover:text-[#EF4444] ml-4 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {state.loading === 'loading' && (
        <div className="mb-6 animate-fade-in">
          <div className="border border-[#3a494b] bg-[#0e0e10]/30 p-4">
            <p className="text-[10px] text-[#b9cacb] animate-pulse uppercase tracking-[0.2em]">
              Cargando integraciones...
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {state.integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onToggle={toggle}
            disabled={state.loading === 'loading'}
          />
        ))}
      </div>
    </>
  );
}
