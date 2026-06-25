import type { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

const STATUS_LABELS: Record<Transaction['status'], string> = {
  ENCRYPTING: 'CIFRANDO',
  UPLOADING: 'SUBENDO',
  COMPLETED: 'COMPLETADO',
  ERROR: 'ERROR',
};

const STATUS_COLORS: Record<Transaction['status'], string> = {
  ENCRYPTING: 'text-[#06B6D4]',
  UPLOADING: 'text-[#F97316]',
  COMPLETED: 'text-[#22C55E]',
  ERROR: 'text-[#EF4444]',
};

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="border border-[#3a494b] bg-[#0e0e10]/30">
        <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          Historial de Transacciones
        </div>
        <div className="p-4 text-[10px] text-[#3a494b] italic">
          No se detectan transmisiones activas...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#3a494b] bg-[#0e0e10]/30">
      <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
        Historial de Transacciones
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[#3a494b] text-[9px] uppercase tracking-[0.2em] text-[#3a494b]">
              <th className="text-left px-4 py-2 font-normal">Archivo</th>
              <th className="text-left px-4 py-2 font-normal">Remitente</th>
              <th className="text-left px-4 py-2 font-normal">Estado</th>
              <th className="text-left px-4 py-2 font-normal">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-[#3a494b]/40 hover:bg-[#1a2d30]/30 transition-colors">
                <td className="px-4 py-3 text-[#E5E1E4] font-mono">{tx.filename}</td>
                <td className="px-4 py-3 text-[#b9cacb]">{tx.sender}</td>
                <td className={`px-4 py-3 font-semibold ${STATUS_COLORS[tx.status]}`}>
                  {STATUS_LABELS[tx.status]}
                </td>
                <td className="px-4 py-3 text-[#b9cacb] text-[10px]">{formatTimestamp(tx.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
