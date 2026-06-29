import { apiFetch } from '@/lib/api';

/** Documento tal como lo devuelve el backend (`/api/documents`). */
export interface BackendDocument {
  id: string;
  name: string;
  storagePath: string;
  mimeType: string;
  fileSizeBytes: number;
  organizationId: string;
  uploadedBy: string;
  createdAt: string;
}

/** Sube un Excel/CSV. El backend ingiere las filas como registros financieros. */
export async function uploadDocument(file: File): Promise<BackendDocument> {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<BackendDocument>('/api/documents', {
    method: 'POST',
    body: form,
  });
}

/** Lista los documentos de la organización del token (orden createdAt DESC). */
export async function listDocuments(): Promise<BackendDocument[]> {
  return apiFetch<BackendDocument[]>('/api/documents');
}

/** Formatea bytes a una unidad legible (KB/MB). */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
