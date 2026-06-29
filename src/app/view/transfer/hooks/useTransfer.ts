'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  listDocuments,
  uploadDocument,
  type BackendDocument,
} from '../services/transfer';

/**
 * Estado compartido de documentos: lista (RECIBIR) + subida (ENVIAR).
 * Tras subir con éxito, refresca la lista para que ambas vistas queden al día.
 */
export function useDocuments() {
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] = useState<BackendDocument | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
      setListError(null);
    } catch (err) {
      setListError((err as Error).message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    listDocuments()
      .then((data) => {
        if (active) {
          setDocuments(data);
          setListError(null);
        }
      })
      .catch((err) => {
        if (active) setListError((err as Error).message);
      })
      .finally(() => {
        if (active) setLoadingList(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setUploadError(null);
      setLastUploaded(null);
      try {
        const doc = await uploadDocument(file);
        setLastUploaded(doc);
        await refresh();
      } catch (err) {
        setUploadError((err as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [refresh],
  );

  const dismissUploadError = useCallback(() => setUploadError(null), []);
  const clearLastUploaded = useCallback(() => setLastUploaded(null), []);

  return {
    documents,
    loadingList,
    listError,
    refresh,
    upload,
    uploading,
    uploadError,
    lastUploaded,
    dismissUploadError,
    clearLastUploaded,
  };
}
