'use client';

import { useState, useEffect } from 'react';
import { IntegrationsView } from './IntegrationsView';
import { RolesView } from './RolesView';
import { EmailView } from './EmailView';
import { ToggleSwitch } from './components/ToggleSwitch';
import { getInternal } from '@/lib/session';

export type ConfigMode = 'integrations' | 'roles' | 'email';

interface Me {
  email: string | null;
}

export function ConfigurationContainer() {
  const [mode, setMode] = useState<ConfigMode>('integrations');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    getInternal<Me>('/api/me')
      .then((me) => setUserEmail(me.email ?? ''))
      .catch(() => {});
  }, []);

  return (
    <div className="relative w-full h-full bg-[#000000] border border-[#3a494b] flex flex-col overflow-hidden">
      <div className="p-6 pb-0 shrink-0">
        <ToggleSwitch mode={mode} onToggle={setMode} />
      </div>
      <div className="relative flex-1 overflow-y-auto p-6 pt-4">
        <div className="animate-fade-in">
          {mode === 'integrations' && <IntegrationsView />}
          {mode === 'roles' && <RolesView />}
          {mode === 'email' && <EmailView userEmail={userEmail} />}
        </div>
      </div>
    </div>
  );
}
