'use client';

import { useEffect } from 'react';
import { initializeThreeScene } from './animationHomeThree';

export default function HomeComponents() {
  useEffect(() => {
    const cleanup = initializeThreeScene('three-sphere-scene');
    return () => { cleanup?.(); };
  }, []);

  return (
    <div className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden bg-background">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #849495 1px, transparent 1px), linear-gradient(to bottom, #849495 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Protagonist: AI Avatar Sphere */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto -mt-12">

        {/* Holographic container */}
        <div className="relative w-[650px] h-[650px] flex items-center justify-center group" id="canvas-container">

          {/* Ambient glow — controlled entirely by pulse-ring CSS animation */}
          <div
            className="absolute inset-0 rounded-full blur-[120px] pulse-ring pointer-events-none"
            style={{ backgroundColor: '#00dbe7' }}
          />

          {/* Three.js canvas */}
          <div id="three-sphere-scene" className="w-full h-full bg-transparent relative z-20" />

          {/* Outer dashed ring 680px */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-primary-fixed-dim opacity-10 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />

          {/* Inner ring 620px */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-primary-fixed-dim opacity-[0.03] animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

        </div>

        {/* Interaction bar — Mac Spotlight style */}
        <div className="relative z-30 w-full max-w-2xl mt-8 transition-all duration-300">

          <div className="glass-panel glass-input flex items-center h-16 rounded-lg px-4 gap-3 shadow-2xl group transition-all duration-300 transform hover:scale-[1.01]">

            <span className="material-symbols-outlined text-primary-fixed-dim opacity-70 group-focus-within:opacity-100 transition-opacity">
              terminal
            </span>

            <input
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none text-on-surface font-data-tabular text-data-tabular placeholder-on-surface-variant focus:ring-0 w-full"
              placeholder="Ingresa un comando financiero o arrastra un reporte aquí..."
              spellCheck={false}
              type="text"
            />

            <div className="flex items-center gap-2 border-l border-outline-variant pl-3 ml-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:text-primary-fixed-dim hover:bg-surface-variant transition-colors"
                title="Voice Input"
              >
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:text-primary-fixed-dim hover:bg-surface-variant transition-colors"
                title="Attach Document"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
            </div>

          </div>

          {/* Command hint */}
          <div className="text-center mt-4">
            <p className="font-data-tabular text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest">
              System ready. Waiting for input...
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
