'use client';

import type { useDocuments } from './hooks/useTransfer';
import { DropzoneArea } from './components/DropzoneArea';

interface SendViewProps {
  docs: ReturnType<typeof useDocuments>;
}

export function SendView({ docs }: SendViewProps) {
  const { upload, uploading, uploadError, lastUploaded, dismissUploadError } = docs;

  const onFileSelect = (file: File) => {
    void upload(file);
  };

  return (
    <>
      {/* Scanline */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-[#00E5FF]/20 animate-scan shadow-[0_0_10px_#00E5FF]" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#00E5FF]">
            Subir documento financiero
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            EXCEL / CSV → INGESTA DE REGISTROS
          </p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] font-mono">
          <p>.XLSX · .XLS · .CSV</p>
        </div>
      </div>

      {/* Dropzone */}
      <DropzoneArea onFileSelect={onFileSelect} disabled={uploading} />

      {/* Error toast */}
      {uploadError && (
        <div className="mb-4 animate-slide-up flex items-center justify-between bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-2 text-[11px] text-[#EF4444]">
          <span className="tracking-[0.05em]">ERROR: {uploadError}</span>
          <button
            onClick={dismissUploadError}
            className="text-[#EF4444]/60 hover:text-[#EF4444] ml-4 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Uploading indicator (indeterminado: fetch no expone progreso real) */}
      {uploading && (
        <div className="mb-4 flex items-center gap-3 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-4 py-3">
          <span className="h-2 w-2 animate-ping rounded-full bg-[#00E5FF]" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
            Subiendo e ingiriendo registros…
          </span>
        </div>
      )}

      {/* Success indicator */}
      {!uploading && lastUploaded && (
        <div className="mb-4 animate-fade-in border border-[#22C55E]/30 bg-[#22C55E]/5 px-4 py-3 text-[11px] text-[#22C55E]">
          ✓ <span className="font-mono">{lastUploaded.name}</span> subido e ingerido
          correctamente. Ya aparece en &quot;Recibir&quot; y puedes consultarlo en el chat.
        </div>
      )}
    </>
  );
}
