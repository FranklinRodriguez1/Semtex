'use client';

interface ProgressBarProps {
  value: number;
  label?: string;
  fileName?: string;
}

export function ProgressBar({ value, label, fileName }: ProgressBarProps) {
  return (
    <div className="mb-8 animate-in fade-in duration-500">
      {(label || fileName) && (
        <div className="flex justify-between text-[10px] mb-2 uppercase text-[#06B6D4]">
          <span>{label ?? `Uploading: ${fileName}`}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="relative h-3 w-full bg-[#0e0e10] overflow-hidden">
        <div
          className="h-full bg-[#06B6D4] transition-[width] duration-300 ease-out relative overflow-hidden"
          style={{ width: `${Math.min(value, 100)}%` }}
        >
          <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
        </div>
      </div>
    </div>
  );
}
