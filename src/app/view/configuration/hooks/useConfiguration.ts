'use client';

import { useState, useCallback, useRef } from 'react';
import type { ConfigurationState } from '../types';
import { fetchConfiguration, toggleIntegration } from '../services/configuration';

const INITIAL_STATE: ConfigurationState = {
  integrations: [],
  roles: [],
  loading: 'idle',
  error: null,
};

export function useConfiguration() {
  const [state, setState] = useState<ConfigurationState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(prev => ({ ...prev, loading: 'loading', error: null }));

    await fetchConfiguration({
      onSuccess: (integrations, roles) => {
        setState({ integrations, roles, loading: 'success', error: null });
      },
      onError: (error) => {
        setState(prev => ({ ...prev, loading: 'error', error }));
      },
    }, controller.signal);
  }, []);

  const toggle = useCallback(async (integrationId: string, enabled: boolean) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    await toggleIntegration(integrationId, enabled, {
      onSuccess: (updated) => {
        setState(prev => ({
          ...prev,
          integrations: prev.integrations.map(i =>
            i.id === updated.id ? updated : i,
          ),
        }));
      },
      onError: (error) => {
        setState(prev => ({ ...prev, error }));
      },
    }, controller.signal);
  }, []);

  const dismissError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return { state, load, toggle, dismissError };
}
