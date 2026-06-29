'use client';

import { useEffect } from 'react';
import { initializeThreeScene } from './animationHomeThree';

export function Home() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cleanup = initializeThreeScene('three-sphere-scene');

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden bg-background">

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #849495 1px, transparent 1px),
            linear-gradient(to bottom, #849495 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* CANVAS CONTAINER */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">

        <div
          className="relative w-[650px] h-[650px] flex items-center justify-center"
          id="canvas-container"
        >
          {/* GLOW BACKGROUND */}
          <div className="absolute inset-0 rounded-full bg-primary-fixed-dim opacity-40 blur-[200px] pointer-events-none" />

          {/* THREE.JS CANVAS */}
          <div
            id="three-sphere-scene"
            className="w-full h-full bg-transparent relative z-20"
          />

          {/* RINGS */}
          <div className="absolute inset-0 rounded-full border border-primary-fixed-dim opacity-20 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-primary-fixed-dim opacity-10 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
        </div>

        {/* INPUT BAR */}
        <div className="relative z-30 w-full max-w-2xl mt-8">

          <div className="glass-panel glass-input flex items-center h-16 rounded-lg px-4 gap-3 shadow-2xl">

            <span className="material-symbols-outlined text-primary-fixed-dim opacity-70">
              terminal
            </span>

            <input
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none text-on-surface"
              placeholder="Ingresa un comando financiero..."
              type="text"
            />

            <div className="flex items-center gap-2 border-l border-outline-variant pl-3 ml-2">

              <button className="w-8 h-8 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  mic
                </span>
              </button>

              <button className="w-8 h-8 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  attach_file
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}