'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { initializeThreeScene } from './animationHomeThree';
import { useAuth } from '@/components/auth/AuthProvider';
import { useChat } from './useChat';
import { useSpeech } from './useSpeech';
import { listDocuments, type BackendDocument } from '@/app/view/transfer/services/transfer';

export default function HomeComponents() {
  const { role } = useAuth();
  const enabled = role === 'ADMIN' || role === 'OPERATOR';
  const [input, setInput] = useState('');
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [speakOn, setSpeakOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const spokenRef = useRef(0);
  const selectedDocRef = useRef(selectedDocId);
  const threeRef = useRef<{ cleanup: () => void; setListening: (v: boolean) => void } | null>(null);

  useEffect(() => {
    selectedDocRef.current = selectedDocId;
  }, [selectedDocId]);

  const { messages, sending, error, send, lastReply } = useChat(enabled);

  const {
    supported: micSupported,
    listening,
    interim,
    error: micError,
    start: startMic,
    stop: stopMic,
    speak,
    cancelSpeech,
  } = useSpeech({
    onFinal: (text) => {
      setInput('');
      void send(text, selectedDocRef.current || undefined);
    },
  });

  useEffect(() => {
    const controls = initializeThreeScene('three-sphere-scene');
    threeRef.current = controls;
    return () => {
      controls.cleanup();
      threeRef.current = null;
    };
  }, []);

  useEffect(() => {
    threeRef.current?.setListening(listening);
  }, [listening]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    listDocuments()
      .then((docs) => {
        if (active) setDocuments(docs);
      })
      .catch(() => {
        // sin documentos o sin permiso: se ignora
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  // Lee en voz solo las respuestas nuevas (no el historial) cuando la voz está activa.
  useEffect(() => {
    if (lastReply && lastReply.n > spokenRef.current) {
      spokenRef.current = lastReply.n;
      if (speakOn) speak(lastReply.text);
    }
  }, [lastReply, speakOn, speak]);

  // Al apagar la voz, corta cualquier lectura en curso.
  useEffect(() => {
    if (!speakOn) cancelSpeech();
  }, [speakOn, cancelSpeech]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!enabled || sending) return;
    const text = input;
    setInput('');
    void send(text, selectedDocId || undefined);
  }

  const hasConversation = messages.length > 0 || sending || error !== null;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background">
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
      <div className="relative z-10 -mt-12">
        <div
          className="group relative flex h-[650px] w-[650px] items-center justify-center"
          id="canvas-container"
        >
          {/* Ambient glow — turns red while listening */}
          <div
            className="pulse-ring pointer-events-none absolute inset-0 rounded-full blur-[120px] transition-colors duration-300"
            style={{ backgroundColor: listening ? '#ef4444' : '#00dbe7' }}
          />

          {/* Three.js canvas */}
          <div id="three-sphere-scene" className="relative z-20 h-full w-full bg-transparent" />

          {/* Outer dashed ring */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-fixed-dim opacity-10 border-dashed animate-[spin_60s_linear_infinite]" />

          {/* Inner ring */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-fixed-dim opacity-[0.03] animate-[spin_40s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* Interaction bar — absolute bottom, always visible regardless of chat history height */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center px-8 pb-6">
        <div className="w-full max-w-4xl transition-all duration-300">
          {/* Conversation panel */}
          {hasConversation && (
            <div
              ref={scrollRef}
              className="glass-panel mb-4 max-h-[38vh] overflow-y-auto rounded-lg px-5 py-4 space-y-3 shadow-2xl"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                      m.role === 'USER'
                        ? 'bg-[#00dbe7]/15 text-on-surface'
                        : 'bg-surface-variant/40 text-on-surface'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-surface-variant/40 px-3 py-2 text-[13px] text-on-surface-variant">
                    <span className="animate-pulse">Analizando…</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2 text-[12px] text-[#EF4444]">
                  {error}
                </div>
              )}
            </div>
          )}

          {enabled && documents.length > 0 && (
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Documento:
              </span>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="max-w-[60%] truncate rounded-md border border-outline-variant bg-[#0e0e10] px-2 py-1 text-[11px] text-on-surface outline-none focus:border-primary-fixed-dim"
              >
                <option value="">Sin documento (general)</option>
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="glass-panel glass-input group flex h-18 items-center gap-3 rounded-lg px-5 shadow-2xl transition-all duration-300 transform hover:scale-[1.01]"
          >
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
              value={listening ? interim : input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!enabled || sending || listening}
              className="w-full min-w-0 flex-1 border-none bg-transparent outline-none focus:ring-0 text-on-surface font-data-tabular text-data-tabular placeholder-on-surface-variant disabled:opacity-60"
              placeholder={
                !enabled
                  ? 'El chat está disponible para roles ADMIN y OPERATOR.'
                  : listening
                    ? 'Escuchando… habla ahora'
                    : 'Pregunta sobre tus datos financieros…'
              }
              spellCheck={false}
              type="text"
            />

            <div className="ml-2 flex items-center gap-2 border-l border-outline-variant pl-3">
              {/* Toggle de voz (que lea las respuestas) */}
              <button
                type="button"
                onClick={() => setSpeakOn((v) => !v)}
                disabled={!enabled}
                title={
                  speakOn
                    ? 'Voz activada: lee las respuestas (clic para silenciar)'
                    : 'Voz desactivada (clic para que lea las respuestas)'
                }
                className={`flex h-8 w-8 items-center justify-center rounded text-base transition-colors disabled:opacity-40 ${
                  speakOn
                    ? 'text-[#00dbe7]'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary-fixed-dim'
                }`}
              >
                {speakOn ? '🔊' : '🔇'}
              </button>

              {/* Micrófono (hablar para dictar) */}
              <button
                type="button"
                onClick={() => (listening ? stopMic() : startMic())}
                disabled={!enabled || !micSupported}
                title={
                  !micSupported
                    ? 'Tu navegador no soporta reconocimiento de voz'
                    : listening
                      ? 'Detener'
                      : 'Hablar'
                }
                className={`flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-40 ${
                  listening
                    ? 'animate-pulse bg-[#EF4444]/20 text-[#EF4444] ring-1 ring-[#EF4444]/50'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary-fixed-dim'
                }`}
              >
                <Image
                  src="/mic.png"
                  alt="Micrófono"
                  width={20}
                  height={20}
                  className="opacity-90"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </button>

              {/* Enviar */}
              <button
                type="submit"
                disabled={!enabled || sending || listening || input.trim() === ''}
                className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary-fixed-dim disabled:opacity-40"
                title="Enviar"
              >
                <Image
                  src="/upload.png"
                  alt="Enviar"
                  width={20}
                  height={20}
                  className="opacity-90 transition-opacity hover:opacity-100"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </button>
            </div>
          </form>

          {/* Command hint */}
          <div className="mt-4 text-center">
            <p
              className={`font-data-tabular text-[10px] uppercase tracking-widest ${
                micError ? 'text-[#EF4444] opacity-80' : 'text-on-surface-variant opacity-50'
              }`}
            >
              {listening
                ? '● Escuchando… habla ahora'
                : micError
                  ? micError
                  : sending
                    ? 'Procesando consulta…'
                    : 'System ready. Waiting for input...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
