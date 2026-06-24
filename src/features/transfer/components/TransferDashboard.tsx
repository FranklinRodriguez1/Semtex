"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export function TransferDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  // Lógica de Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCurrentFile(file.name);
        setIsUploading(true);
        // Aquí podrías añadir el trigger para llamar a tu lógica de backend
      }
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <div className="relative w-full h-full bg-[#000000] border border-[#3a494b] p-6 text-[#E5E1E4] overflow-hidden">
      {/* 1. Efecto Scanline global */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-cyan-500/20 animate-scan shadow-[0_0_10px_#00E5FF]" />
      </div>

      {/* 2. Header de Protocolo */}
      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#06B6D4]">Document Transfer Protocol</h1>
          <p className="text-[10px] text-[#3a494b] mt-1">SECURE_P2P_TUNNEL_V2.0</p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          <p>AES-256-GCM / RSA-4096</p>
        </div>
      </div>

      {/* 3. Área de Dropzone con interacción */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed p-10 text-center rounded-sm mb-6 transition-all cursor-pointer 
          ${isDragActive 
            ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse" 
            : "border-[#06B6D4]/30 animate-led-pulse bg-[#0e0e10]/50"
          }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-4 text-[#06B6D4]">⤓</div>
        <p className={`text-[12px] uppercase tracking-[0.3em] ${isDragActive ? "text-cyan-300" : "text-[#06B6D4]"}`}>
          {isDragActive ? "SOLTAR ARCHIVO AHORA" : "SOLTAR DOCUMENTOS PARA CIFRADO"}
        </p>
        <p className="text-[9px] text-[#3a494b] mt-2">OR SELECT LOCAL_FILE_SYSTEM_NODE</p>
      </div>

      {/* 4. Barra de Carga Dinámica */}
      {isUploading && (
        <div className="mb-8 animate-in fade-in duration-500">
          <div className="flex justify-between text-[10px] mb-2 uppercase text-[#06B6D4]">
            <span>Uploading: {currentFile}</span>
            <span>68%</span>
          </div>
          <div className="flex gap-1 h-3 w-full bg-[#0e0e10]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-full w-full ${i < 13 ? 'bg-[#06B6D4] animate-pulse' : 'bg-[#1a2d30]'}`} 
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Tabla de Historial (Estructura base) */}
      <div className="border border-[#3a494b] bg-[#0e0e10]/30">
        <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          Transaction_History_Log
        </div>
        <div className="p-4 text-[10px] text-[#3a494b] italic">
          No active transmissions detected...
        </div>
      </div>
    </div>
  );
}