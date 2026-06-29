'use client';

import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

interface DropzoneAreaProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/csv': ['.csv'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
};

export function DropzoneArea({ onFileSelect, disabled }: DropzoneAreaProps) {
  const [hovered, setHovered] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) onFileSelect(file);
    },
    accept: ACCEPTED_TYPES,
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative border-2 border-dashed p-10 text-center rounded-sm mb-6
        transition-all duration-300 cursor-pointer overflow-hidden
        ${
          isDragActive
            ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_30px_rgba(0,229,255,0.4)] scale-[1.01]'
            : hovered
              ? 'border-[#00E5FF]/60 bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
              : 'border-[#00E5FF]/30 bg-[#0e0e10]/50 animate-led-pulse'
        }
        ${disabled ? 'opacity-40 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div
        className={`text-4xl mb-4 transition-all duration-300 ${
          isDragActive ? 'text-[#00E5FF] scale-110' : 'text-[#00E5FF]'
        }`}
      >
        ⤓
      </div>
      <p
        className={`text-[12px] uppercase tracking-[0.3em] transition-all duration-300 ${
          isDragActive ? 'text-[#00E5FF]' : 'text-[#00E5FF]/80'
        }`}
      >
        {isDragActive ? 'SOLTAR ARCHIVO AHORA' : 'SOLTAR DOCUMENTOS PARA CIFRADO'}
      </p>
      <p className="text-[9px] text-[#3a494b] mt-2 tracking-[0.15em]">
        O SELECCIONAR DESDE EL SISTEMA LOCAL
      </p>
    </div>
  );
}
