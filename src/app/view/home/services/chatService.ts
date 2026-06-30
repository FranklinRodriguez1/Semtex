import { apiFetch } from '@/lib/api';

export type MessageRole = 'USER' | 'ASSISTANT';

export interface ChatHistoryMessage {
  id: string;
  role: MessageRole;
  content: string;
  userId: string;
  documentId: string | null;
  tokensUsed: number | null;
  createdAt: string;
}

export interface SendResponse {
  agentResponse: string;
  relevantRecords: unknown[];
}

export async function sendMessage(
  content: string,
  documentId?: string,
): Promise<SendResponse> {
  return apiFetch<SendResponse>('/api/chat/messages', {
    method: 'POST',
    body: JSON.stringify(documentId ? { content, documentId } : { content }),
  });
}

export async function getHistory(limit = 100): Promise<ChatHistoryMessage[]> {
  return apiFetch<ChatHistoryMessage[]>(`/api/chat/messages?limit=${limit}`);
}
