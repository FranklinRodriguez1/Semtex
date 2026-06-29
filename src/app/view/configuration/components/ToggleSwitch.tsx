'use client';

import type { ConfigMode } from '../ConfigurationContainer';

interface ToggleSwitchProps {
  mode: ConfigMode;
  onToggle: (mode: ConfigMode) => void;
}

export function ToggleSwitch({ mode, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex w-full max-w-md mx-auto bg-[rgba(15,23,42,0.7)] rounded-3xl p-1">
      <button
        type="button"
        onClick={() => onToggle('integrations')}
        className={`
          flex-1 py-2.5 text-[11px] uppercase tracking-[0.3em] rounded-2xl
          transition-all duration-300
          ${mode === 'integrations'
            ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]'
            : 'text-[rgba(0,229,255,0.4)] hover:text-[rgba(0,229,255,0.7)]'
          }
        `}
      >
        INTEGRACIONES
      </button>
      <button
        type="button"
        onClick={() => onToggle('roles')}
        className={`
          flex-1 py-2.5 text-[11px] uppercase tracking-[0.3em] rounded-2xl
          transition-all duration-300
          ${mode === 'roles'
            ? 'bg-[#F97316]/10 text-[#F97316] font-bold shadow-[0_0_12px_rgba(249,115,22,0.15)]'
            : 'text-[rgba(249,115,22,0.4)] hover:text-[rgba(249,115,22,0.7)]'
          }
        `}
      >
        ROLES
      </button>
    </div>
  );
}
