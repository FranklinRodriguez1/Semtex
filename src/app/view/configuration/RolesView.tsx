'use client';

import { useEffect } from 'react';
import { useConfiguration } from './hooks/useConfiguration';
import { RoleTable } from './components/RoleTable';

interface RolesViewProps {
  onAction?: (action: string, data?: unknown) => void;
}

export function RolesView(_props: RolesViewProps) {
  const { state, load } = useConfiguration();

  useEffect(() => {
    if (state.loading === 'idle') load();
  }, [state.loading, load]);

  return (
    <>
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-[#F97316]/20 animate-scan shadow-[0_0_10px_#F97316]" />
      </div>

      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#F97316]">
            Roles & Permissions
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            ACCESS_CONTROL_PROTOCOL
          </p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] font-mono">
          <p>RBAC / ABAC / ACL</p>
        </div>
      </div>

      {state.loading === 'loading' && (
        <div className="mb-6 animate-fade-in">
          <div className="border border-[#3a494b] bg-[#0e0e10]/30 p-4">
            <p className="text-[10px] text-[#b9cacb] animate-pulse uppercase tracking-[0.2em]">
              Cargando roles...
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <RoleTable roles={state.roles} />
      </div>

      <div className="border border-[#3a494b] bg-[#0e0e10]/30 p-4">
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#3a494b] mb-2">Permission Sync Status</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
          <span className="text-[10px] text-[#b9cacb]">Políticas de acceso sincronizadas — RBAC activo</span>
        </div>
      </div>
    </>
  );
}
