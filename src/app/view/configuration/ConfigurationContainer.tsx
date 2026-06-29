'use client';

import { useState } from 'react';
import { IntegrationsView } from './IntegrationsView';
import { RolesView } from './RolesView';
import { ToggleSwitch } from './components/ToggleSwitch';

export type ConfigMode = 'integrations' | 'roles';

export function ConfigurationContainer() {
  const [mode, setMode] = useState<ConfigMode>('integrations');

  return (
    <div className="relative w-full h-full bg-[#000000] border border-[#3a494b] flex flex-col overflow-hidden">
      <div className="p-6 pb-0 shrink-0">
        <ToggleSwitch mode={mode} onToggle={setMode} />
      </div>
      <div className="relative flex-1 overflow-y-auto p-6 pt-4">
        <div className="animate-fade-in">
          {mode === 'integrations' ? <IntegrationsView /> : <RolesView />}
        </div>
      </div>
    </div>
  );
}
