'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { initializeThreeScene } from '@/utils/animationHomeThree';
import { getInternal } from '@/lib/session';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { listDocuments, type BackendDocument } from '@/app/view/transfer/services/transfer';
import { supabase } from '@/lib/supabase';

type EmailStep = 'asking_to' | 'asking_subject' | 'asking_body' | 'confirming';

interface EmailState {
  step: EmailStep;
  to: string;
  subject: string;
  body: string;
}

interface Me {
  isSuperAdmin: boolean;
  role: string | null;
}

function isEmailIntent(text: string): boolean {
  const l = text.toLowerCase();
  return (
    l.includes('enviar correo') ||
    l.includes('enviar un correo') ||
    l.includes('mandar correo') ||
    l.includes('quiero enviar') ||
    l.includes('send email') ||
    l.includes('send mail')
  );
}

export default function HomeComponents() {
  const [enabled, setEnabled] = useState(false);
  const [input, setInput] = useState('');
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [speakOn, setSpeakOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const spokenRef = useRef(0);
  const selectedDocRef = useRef(selectedDocId);
  const speakOnRef = useRef(speakOn);
  const emailRef = useRef<EmailState | null>(null);

  useEffect(() => { selectedDocRef.current = selectedDocId; }, [selectedDocId]);
  useEffect(() => { speakOnRef.current = speakOn; }, [speakOn]);

  const { messages, sending, error, send, lastReply, injectMessage } = useChat(enabled);

  const say = useCallback((text: string, speakFn: (t: string) => void) => {
    injectMessage(text);
    if (speakOnRef.current) speakFn(text);
  }, [injectMessage]);

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
      void handleUserInput(text);
    },
  });

  const handleUserInput = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // —— En flujo de email ——
    if (emailRef.current) {
      const state = emailRef.current;

      if (state.step === 'asking_to') {
        const newState: EmailState = { ...state, to: trimmed, step: 'asking_subject' };
        emailRef.current = newState;
        injectMessage(trimmed, 'USER');
        const msg = `Entendido, el correo irá a ${trimmed}.\n¿Cuál es el asunto?`;
        say(msg, speak);
        return;
      }

      if (state.step === 'asking_subject') {
        const newState: EmailState = { ...state, subject: trimmed, step: 'asking_body' };
        emailRef.current = newState;
        injectMessage(trimmed, 'USER');
        const msg = 'Perfecto. ¿Qué quieres decir en el cuerpo del mensaje?';
        say(msg, speak);
        return;
      }

      if (state.step === 'asking_body') {
        const newState: EmailState = { ...state, body: trimmed, step: 'confirming' };
        emailRef.current = newState;
        injectMessage(trimmed, 'USER');
        const summary =
          `Esto es lo que voy a enviar:\n\n` +
          `Para: ${newState.to}\n` +
          `Asunto: ${newState.subject}\n` +
          `Mensaje: ${trimmed}\n\n` +
          `¿Está bien así? Di "enviar" para confirmar o "cancelar" para cancelar.`;
        say(summary, speak);
        return;
      }

      if (state.step === 'confirming') {
        const lower = trimmed.toLowerCase();
        injectMessage(trimmed, 'USER');

        if (lower.includes('cancelar') || lower.includes('cancel')) {
          emailRef.current = null;
          say('Correo cancelado. ¿En qué más puedo ayudarte?', speak);
          return;
        }

        if (!lower.includes('enviar') && !lower.includes('sí') && !lower.includes('si') && !lower.includes('ok')) {
          say('No entendí. Di "enviar" para confirmar o "cancelar" para cancelar.', speak);
          return;
        }

        try {
          const { data: { session } } = await supabase.auth.getSession();
          const res = await fetch('/api/mail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
            },
            body: JSON.stringify({ to: state.to, subject: state.subject, body: state.body }),
          });
          emailRef.current = null;
          if (!res.ok) {
            const data = await res.json() as { message?: string };
            throw new Error(data.message ?? 'Error al enviar.');
          }
          say(`¡Correo enviado correctamente a ${state.to}! ¿En qué más puedo ayudarte?`, speak);
        } catch (err) {
          say(`Error al enviar el correo: ${(err as Error).message}`, speak);
          emailRef.current = null;
        }
        return;
      }
    }

    // —— Intent de email: iniciar flujo ——
    if (isEmailIntent(trimmed)) {
      emailRef.current = { step: 'asking_to', to: '', subject: '', body: '' };
      injectMessage(trimmed, 'USER');
      const msg = 'Claro, vamos a redactar el correo. ¿A qué dirección de email quieres enviarlo?';
      say(msg, speak);
      return;
    }

    // —— Chat normal con IA ——
    void send(trimmed, selectedDocRef.current || undefined);
  }, [injectMessage, say, speak, send]);

  useEffect(() => {
    const cleanup = initializeThreeScene('three-sphere-scene');
    return () => { cleanup?.(); };
  }, []);

  useEffect(() => {
    getInternal<Me>('/api/me')
      .then((me) => setEnabled(me.role === 'ADMIN' || me.role === 'OPERATOR'))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    listDocuments()
      .then((docs) => { if (active) setDocuments(docs); })
      .catch(() => {});
    return () => { active = false; };
  }, [enabled]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    if (lastReply && lastReply.n > spokenRef.current) {
      spokenRef.current = lastReply.n;
      if (speakOn) speak(lastReply.text);
    }
  }, [lastReply, speakOn, speak]);

  useEffect(() => {
    if (!speakOn) cancelSpeech();
  }, [speakOn, cancelSpeech]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled || sending) return;
    const text = input.trim();
    if (!text) return;
    setInput('');
    void handleUserInput(text);
  }

  const hasConversation = messages.length > 0 || sending || error !== null;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, #849495 1px, transparent 1px), linear-gradient(to bottom, #849495 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center -mt-12">
        <div
          className="group relative flex h-[650px] w-[650px] items-center justify-center"
          id="canvas-container"
        >
          <div
            className="pulse-ring pointer-events-none absolute inset-0 rounded-full blur-[120px]"
            style={{ backgroundColor: '#00dbe7' }}
          />
          <div id="three-sphere-scene" className="relative z-20 h-full w-full bg-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-fixed-dim opacity-10 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-fixed-dim opacity-[0.03] animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        <div className="relative z-30 mt-8 w-full max-w-4xl transition-all duration-300">
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
                    : 'Pregunta sobre tus datos o di "quiero enviar un correo"…'
              }
              spellCheck={false}
              type="text"
            />

            <div className="ml-2 flex items-center gap-2 border-l border-outline-variant pl-3">
              <button
                type="button"
                onClick={() => setSpeakOn((v) => !v)}
                disabled={!enabled}
                title={speakOn ? 'Voz activada (clic para silenciar)' : 'Voz desactivada'}
                className={`flex h-8 w-8 items-center justify-center rounded text-base transition-colors disabled:opacity-40 ${
                  speakOn ? 'text-[#00dbe7]' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary-fixed-dim'
                }`}
              >
                {speakOn ? '🔊' : '🔇'}
              </button>

              <button
                type="button"
                onClick={() => (listening ? stopMic() : startMic())}
                disabled={!enabled || !micSupported}
                title={!micSupported ? 'Tu navegador no soporta reconocimiento de voz' : listening ? 'Detener' : 'Hablar'}
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
