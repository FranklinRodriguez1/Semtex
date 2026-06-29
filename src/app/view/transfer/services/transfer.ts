import type { Transaction, UploadProgress, UploadStatus } from '../types';

const API_BASE = '/api/transfer';

export interface UploadResponse {
  transactionId: string;
  status: UploadStatus;
}

export interface UploadCallbacks {
  onProgress: (progress: UploadProgress) => void;
  onSuccess: (transaction: Transaction) => void;
  onError: (error: string) => void;
}

export async function uploadFile(
  file: File,
  sender: string,
  callbacks: UploadCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sender', sender);

  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      callbacks.onError(errorBody || `Upload failed with status ${response.status}`);
      return;
    }

    const result: UploadResponse = await response.json();
    const transaction: Transaction = {
      id: result.transactionId,
      filename: file.name,
      sender,
      status: result.status === 'completed' ? 'COMPLETED' : 'UPLOADING',
      timestamp: new Date().toISOString(),
    };
    callbacks.onSuccess(transaction);
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    callbacks.onError((err as Error).message || 'Network error');
  }
}
