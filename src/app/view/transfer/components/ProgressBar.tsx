'use client';

interface ProgressBarProps {
  value: number;
  label?: string;
  fileName?: string;
}

export function ProgressBar({ value, label, fileName }: ProgressBarProps) {
  return (
    <div className="mb-8 animate-fade-in">
      {(label || fileName) && (
        <div className="flex justify-between text-[10px] mb-2 uppercase tracking-[0.15em] text-[#00E5FF]">
          <span>{label ?? fileName}</span>
          <span className="font-mono tabular-nums">{value}%</span>
        </div>
      )}
      <div className="relative h-3 w-full bg-[#0e0e10] border border-[#1a2d30] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] transition-all duration-500 ease-out relative overflow-hidden animate-progress-pulse"
          style={{ width: `${Math.min(value, 100)}%` }}
        >
          <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
