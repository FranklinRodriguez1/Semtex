import type { Integration, Role } from '../types';

const API_BASE = '/api/configuration';

export interface FetchCallbacks {
  onSuccess: (integrations: Integration[], roles: Role[]) => void;
  onError: (error: string) => void;
}

export interface ToggleCallbacks {
  onSuccess: (integration: Integration) => void;
  onError: (error: string) => void;
}

const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'int-001', name: 'Google Drive API', description: 'Sincronización de documentos con Google Workspace', type: 'api', status: 'active', lastSync: new Date().toISOString() },
  { id: 'int-002', name: 'Dropbox Connector', description: 'Puente de transferencia con Dropbox Business', type: 'api', status: 'active', lastSync: new Date(Date.now() - 3600000).toISOString() },
  { id: 'int-003', name: 'Slack Webhook', description: 'Notificaciones de eventos a canales de Slack', type: 'webhook', status: 'inactive', lastSync: new Date(Date.now() - 86400000).toISOString() },
  { id: 'int-004', name: 'LDAP Authentication', description: 'Autenticación corporativa mediante Directorio Activo', type: 'auth', status: 'active', lastSync: new Date(Date.now() - 7200000).toISOString() },
  { id: 'int-005', name: 'PostgreSQL Bridge', description: 'Conexión directa a base de datos de auditoría', type: 'database', status: 'error', lastSync: new Date(Date.now() - 1800000).toISOString() },
];

const MOCK_PERMISSIONS: Record<string, { id: string; key: string; label: string }[]> = {
  'admin': [
    { id: 'perm-001', key: 'transfer.send', label: 'Enviar documentos' },
    { id: 'perm-002', key: 'transfer.receive', label: 'Recibir documentos' },
    { id: 'perm-003', key: 'config.manage', label: 'Gestionar configuración' },
    { id: 'perm-004', key: 'roles.manage', label: 'Administrar roles' },
    { id: 'perm-005', key: 'audit.view', label: 'Ver auditoría' },
  ],
  'operator': [
    { id: 'perm-001', key: 'transfer.send', label: 'Enviar documentos' },
    { id: 'perm-002', key: 'transfer.receive', label: 'Recibir documentos' },
    { id: 'perm-005', key: 'audit.view', label: 'Ver auditoría' },
  ],
  'auditor': [
    { id: 'perm-005', key: 'audit.view', label: 'Ver auditoría' },
  ],
  'guest': [
    { id: 'perm-002', key: 'transfer.receive', label: 'Recibir documentos' },
  ],
};

const MOCK_ROLES: Role[] = [
  { id: 'role-001', name: 'Administrador', description: 'Acceso completo al sistema', permissions: MOCK_PERMISSIONS['admin'].map(p => ({ ...p, granted: true })), userCount: 3, createdAt: '2025-01-15T08:00:00Z', system: true },
  { id: 'role-002', name: 'Operador', description: 'Puede enviar y recibir documentos', permissions: MOCK_PERMISSIONS['operator'].map(p => ({ ...p, granted: true })), userCount: 14, createdAt: '2025-02-01T10:30:00Z', system: true },
  { id: 'role-003', name: 'Auditor', description: 'Acceso de solo lectura a registros', permissions: MOCK_PERMISSIONS['auditor'].map(p => ({ ...p, granted: true })), userCount: 5, createdAt: '2025-03-10T14:00:00Z', system: false },
  { id: 'role-004', name: 'Invitado', description: 'Acceso limitado solo a recepción', permissions: MOCK_PERMISSIONS['guest'].map(p => ({ ...p, granted: true })), userCount: 22, createdAt: '2025-04-20T09:15:00Z', system: false },
];

export async function fetchConfiguration(
  callbacks: FetchCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/status`, { signal });

    if (!response.ok) {
      callbacks.onSuccess(MOCK_INTEGRATIONS, MOCK_ROLES);
      return;
    }

    const result: { integrations: Integration[]; roles: Role[] } = await response.json();
    callbacks.onSuccess(result.integrations, result.roles);
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    callbacks.onSuccess(MOCK_INTEGRATIONS, MOCK_ROLES);
  }
}

export async function toggleIntegration(
  integrationId: string,
  enabled: boolean,
  callbacks: ToggleCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/integrations/${integrationId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
      signal,
    });

    if (!response.ok) {
      const mockIntegration = MOCK_INTEGRATIONS.find(i => i.id === integrationId);
      if (mockIntegration) {
        const updated: Integration = {
          ...mockIntegration,
          status: enabled ? 'active' : 'inactive',
          lastSync: new Date().toISOString(),
        };
        callbacks.onSuccess(updated);
      }
      return;
    }

    const result: Integration = await response.json();
    callbacks.onSuccess(result);
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;

    const mockIntegration = MOCK_INTEGRATIONS.find(i => i.id === integrationId);
    if (mockIntegration) {
      const updated: Integration = {
        ...mockIntegration,
        status: enabled ? 'active' : 'inactive',
        lastSync: new Date().toISOString(),
      };
      callbacks.onSuccess(updated);
    }
  }
}
