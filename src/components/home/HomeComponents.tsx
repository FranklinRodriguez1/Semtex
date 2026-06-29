'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { initializeThreeScene } from './animationHomeThree';

export default function HomeComponents() {
  useEffect(() => {
    const cleanup = initializeThreeScene('three-sphere-scene');
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, #849495 1px, transparent 1px), linear-gradient(to bottom, #849495 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Protagonist: AI Avatar Sphere */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center -mt-12">
        {/* Holographic container */}
        <div
          className="group relative flex h-[650px] w-[650px] items-center justify-center"
          id="canvas-container"
        >
          {/* Ambient glow */}
          <div
            className="pulse-ring pointer-events-none absolute inset-0 rounded-full blur-[120px]"
            style={{ backgroundColor: '#00dbe7' }}
          />

          {/* Three.js canvas */}
          <div id="three-sphere-scene" className="relative z-20 h-full w-full bg-transparent" />

          {/* Outer dashed ring */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-fixed-dim opacity-10 border-dashed animate-[spin_60s_linear_infinite]" />

          {/* Inner ring */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-fixed-dim opacity-[0.03] animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        {/* Interaction bar */}
        <div className="relative z-30 mt-8 w-full max-w-4xl transition-all duration-300">
          <div className="glass-panel glass-input group flex h-18 items-center gap-3 rounded-lg px-5 shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
            <Image
              src="/console.png"
              alt="Terminal"
              width={24}
              height={24}
              className="opacity-90 transition-opacity group-focus-within:opacity-100"
              style={{ filter: 'brightness(0) invert(1)' }}
            />

            <input
              autoComplete="off"
              className="w-full min-w-0 flex-1 border-none bg-transparent outline-none focus:ring-0 text-on-surface font-data-tabular text-data-tabular placeholder-on-surface-variant"
              placeholder="Ingresa un comando financiero o arrastra un reporte aquí..."
              spellCheck={false}
              type="text"
            />

            <div className="ml-2 flex items-center gap-2 border-l border-outline-variant pl-3">
              <button
                className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary-fixed-dim"
                title="Voice Input"
                type="button"
              >
                <Image
                  src="/mic.png"
                  alt="Micrófono"
                  width={20}
                  height={20}
                  className="opacity-90 transition-opacity hover:opacity-100"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary-fixed-dim"
                title="Attach Document"
                type="button"
              >
                <Image
                  src="/upload.png"
                  alt="Adjuntar archivo"
                  width={20}
                  height={20}
                  className="opacity-90 transition-opacity hover:opacity-100"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </button>
            </div>
          </div>

          {/* Command hint */}
          <div className="mt-4 text-center">
            <p className="font-data-tabular text-[10px] uppercase tracking-widest text-on-surface-variant opacity-50">
              System ready. Waiting for input...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
