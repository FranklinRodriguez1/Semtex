'use client';

import { useTransfer } from '../hooks/useTransfer';
import { DropzoneArea } from './DropzoneArea';
import { ProgressBar } from './ProgressBar';
import { TransactionTable } from './TransactionTable';

export function IngestContainer() {
  const { state, handleUpload, reset, dismissError } = useTransfer();

  const onFileSelect = (file: File) => {
    const sender = 'USER@SEMTEX.CORE';
    handleUpload(file, sender);
  };

  return (
    <div className="relative w-full h-full bg-[#000000] border border-[#3a494b] p-6 text-[#E5E1E4] overflow-hidden">
      {/* Scanline */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-cyan-500/20 animate-scan shadow-[0_0_10px_#00E5FF]" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#06B6D4]">Document Transfer Protocol</h1>
          <p className="text-[10px] text-[#3a494b] mt-1">SECURE_P2P_TUNNEL_V2.0</p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          <p>AES-256-GCM / RSA-4096</p>
        </div>
      </div>

      {/* Dropzone */}
      <DropzoneArea onFileSelect={onFileSelect} disabled={state.status === 'uploading'} />

      {/* Error toast */}
      {state.error && (
        <div className="mb-4 flex items-center justify-between bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-sm px-4 py-2 text-[11px] text-[#EF4444]">
          <span>ERROR: {state.error}</span>
          <button onClick={dismissError} className="text-[#EF4444]/60 hover:text-[#EF4444] ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Progress */}
      {state.status === 'uploading' && (
        <ProgressBar
          value={state.progress.percentage}
          fileName={state.currentFile?.name}
        />
      )}

      {/* Success indicator */}
      {state.status === 'completed' && (
        <div className="mb-8 text-[10px] text-[#22C55E] uppercase tracking-[0.2em] animate-in fade-in duration-500">
          ✓ Transferencia completada — {state.transactions[0]?.filename}
          <button
            onClick={reset}
            className="ml-4 text-[#06B6D4] underline hover:text-[#22C55E] transition-colors"
          >
            Nueva transferencia
          </button>
        </div>
      )}

      {/* Transaction History */}
      <TransactionTable transactions={state.transactions} />
    </div>
  );
}
