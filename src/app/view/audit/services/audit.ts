import { apiFetch } from '@/lib/api';

export type AuditAction =
  | 'DOCUMENT_UPLOADED'
  | 'FINANCIAL_QUERY'
  | 'EMAIL_SENT'
  | 'EMAIL_FAILED'
  | 'USER_LOGIN'
  | 'USER_CREATED'
  | 'USER_DEACTIVATED'
  | 'ROLE_CHANGED';

export interface AuditLog {
  id: string;
  action: AuditAction;
  description: string;
  performedBy: string;
  createdAt: string;
}

export async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  return apiFetch<AuditLog[]>(`/api/audit/logs?limit=${limit}`);
}
