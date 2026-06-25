'use client';

import { useDropzone } from 'react-dropzone';

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
      className={`border-2 border-dashed p-10 text-center rounded-sm mb-6 transition-all cursor-pointer
        ${isDragActive
          ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse'
          : 'border-[#06B6D4]/30 animate-led-pulse bg-[#0e0e10]/50'
        }
        ${disabled ? 'opacity-40 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="text-4xl mb-4 text-[#06B6D4]">⤓</div>
      <p className={`text-[12px] uppercase tracking-[0.3em] ${isDragActive ? 'text-cyan-300' : 'text-[#06B6D4]'}`}>
        {isDragActive ? 'SOLTAR ARCHIVO AHORA' : 'SOLTAR DOCUMENTOS PARA CIFRADO'}
      </p>
      <p className="text-[9px] text-[#3a494b] mt-2">O SELECCIONAR DESDE EL SISTEMA LOCAL</p>
    </div>
  );
}
