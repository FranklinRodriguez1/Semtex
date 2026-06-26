'use client';

import { useState } from 'react';
import { SendView } from './SendView';
import { ReceiveView } from './ReceiveView';

export function TransferContainer() {
  const [mode, setMode] = useState<'send' | 'receive'>('send');

  const isReceive = mode === 'receive';
  const accentColor = isReceive ? '#F97316' : '#00E5FF';
  const accentRgb = isReceive ? '249,115,22' : '0,229,255';

  const activeIndicatorStyle = {
    transform: isReceive ? 'translateX(calc(100% + 8px))' : 'translateX(0)',
    backgroundColor: `rgba(${accentRgb}, 0.18)`,
    borderColor: `rgba(${accentRgb}, 0.45)`,
  };

  return (
    <div className="relative w-full h-full bg-[#000000] border border-[#3a494b] p-6 text-[#E5E1E4] overflow-hidden">
      {/* Toggle Switch — estilo loginy */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => setMode((prev) => (prev === 'send' ? 'receive' : 'send'))}
          className="group relative w-48 h-12 rounded-3xl bg-[rgba(15,23,42,0.7)] p-1 transition-transform duration-200 hover:scale-[0.99]"
        >
          <div className="absolute inset-0 flex justify-between px-5 items-center text-[11px] uppercase tracking-[0.3em] z-10">
            <span style={{ color: isReceive ? `rgba(${accentRgb}, 0.4)` : accentColor, fontWeight: isReceive ? 400 : 700 }}>
              ENVIAR
            </span>
            <span style={{ color: isReceive ? accentColor : `rgba(${accentRgb}, 0.4)`, fontWeight: isReceive ? 700 : 400 }}>
              RECIBIR
            </span>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-[#0e0e10]/65" />
          <div
            className="absolute left-1 top-1 bottom-1 w-[calc(50%-10px)] rounded-3xl transition-all duration-500 ease-in-out"
            style={activeIndicatorStyle}
          />
        </button>
      </div>

      {/* Conditional View */}
      <div className="relative animate-fade-in">
        {mode === 'send' ? <SendView /> : <ReceiveView />}
      </div>
    </div>
  );
}
