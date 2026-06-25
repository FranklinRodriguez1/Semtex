'use client';

import { useState, useCallback, useRef } from 'react';
import type { Transaction, UploadProgress, TransferState } from '../types';
import { uploadFile } from '../services/transfer';

const INITIAL_STATE: TransferState = {
  status: 'idle',
  currentFile: null,
  progress: { percentage: 0, bytesUploaded: 0, bytesTotal: 0 },
  transactions: [],
  error: null,
};

export function useTransfer() {
  const [state, setState] = useState<TransferState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const handleUpload = useCallback(async (file: File, sender: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const totalBytes = file.size;
    // Simulate progress via chunked reading until backend provides real progress
    const simulateProgress = (() => {
      let last = 0;
      return setInterval(() => {
        const next = Math.min(last + Math.random() * 15, 90);
        last = next;
        setState((prev) => ({
          ...prev,
          progress: {
            percentage: Math.round(next),
            bytesUploaded: Math.round((next / 100) * totalBytes),
            bytesTotal: totalBytes,
          },
        }));
        if (next >= 90) clearInterval(simulateProgress);
      }, 400);
    })();

    setState((prev) => ({
      ...prev,
      status: 'uploading',
      currentFile: file,
      error: null,
      progress: { percentage: 0, bytesUploaded: 0, bytesTotal: totalBytes },
    }));

    await uploadFile(file, sender, {
      onProgress: (progress) => {
        setState((prev) => ({ ...prev, progress }));
      },
      onSuccess: (transaction) => {
        clearInterval(simulateProgress);
        setState((prev) => ({
          ...prev,
          status: 'completed',
          progress: { percentage: 100, bytesUploaded: totalBytes, bytesTotal: totalBytes },
          transactions: [transaction, ...prev.transactions],
        }));
      },
      onError: (error) => {
        clearInterval(simulateProgress);
        setState((prev) => ({
          ...prev,
          status: 'error',
          error,
        }));
      },
    }, controller.signal);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL_STATE);
  }, []);

  const dismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { state, handleUpload, reset, dismissError };
}
