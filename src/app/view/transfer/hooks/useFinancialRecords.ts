'use client';

import { useState, useEffect } from 'react';
import { getFinancialRecords, type FinancialRecord } from '../services/transfer';

export function useFinancialRecords(documentId: string | null) {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setRecords([]);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    getFinancialRecords(documentId)
      .then((data) => { if (active) setRecords(data); })
      .catch((err) => { if (active) setError((err as Error).message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [documentId]);

  return { records, loading, error };
}
