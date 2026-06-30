import { apiFetch } from '@/lib/api';

export type MessageRole = 'USER' | 'ASSISTANT';

/** Mensaje del historial tal como lo devuelve el backend (GET /api/chat/messages). */
export interface ChatHistoryMessage {
  id: string;
  role: MessageRole;
  content: string;
  userId: string;
  documentId: string | null;
  tokensUsed: number | null;
  createdAt: string;
}

/** Respuesta al enviar un mensaje (POST /api/chat/messages). */
export interface SendResponse {
  agentResponse: string;
  relevantRecords: unknown[];
}

/** Envía un mensaje al agente. `documentId` opcional para acotar al contexto de un documento. */
export async function sendMessage(
  content: string,
  documentId?: string,
): Promise<SendResponse> {
  return apiFetch<SendResponse>('/api/chat/messages', {
    method: 'POST',
    body: JSON.stringify(documentId ? { content, documentId } : { content }),
  });
}

/** Historial de mensajes del usuario actual (orden cronológico). */
export async function getHistory(limit = 100): Promise<ChatHistoryMessage[]> {
  return apiFetch<ChatHistoryMessage[]>(`/api/chat/messages?limit=${limit}`);
}
