export interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'webhook' | 'database' | 'auth';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  configUrl?: string;
}

export interface Permission {
  id: string;
  key: string;
  label: string;
  granted: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
  system: boolean;
}

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ConfigurationState {
  integrations: Integration[];
  roles: Role[];
  loading: LoadingStatus;
  error: string | null;
}
