'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Tipos mínimos de la Web Speech API (no están en lib.dom estándar / van con prefijo webkit). */
interface SpeechAlternative {
  transcript: string;
}
interface SpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechAlternative;
}
interface SpeechResultList {
  readonly length: number;
  [index: number]: SpeechResult;
}
interface SpeechResultEvent {
  readonly resultIndex: number;
  readonly results: SpeechResultList;
}
interface SpeechErrorEvent {
  readonly error: string;
}
interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function mapError(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Permiso de micrófono denegado.';
    case 'no-speech':
      return 'No se detectó voz. Intenta de nuevo.';
    case 'audio-capture':
      return 'No se encontró micrófono.';
    case 'network':
      return 'El navegador bloqueó el servicio de voz. Usa Chrome o activa los permisos en tu navegador.';
    case 'language-not-supported':
      return 'Idioma no soportado por este navegador.';
    case 'aborted':
      // abort() interno — no mostrar al usuario
      return '';
    default:
      return `Error de voz: ${code}`;
  }
}

/**
 * Reconocimiento de voz (audio → texto) y síntesis (texto → voz) con la Web Speech API.
 * Crea una instancia fresca de SpeechRecognition en cada llamada a start() para evitar
 * el bug de Chrome donde reutilizar la misma instancia tras onend genera errores espurios.
 * Requiere contexto seguro (https o localhost) y Chrome/Edge.
 */
export function useSpeech(opts: { onFinal: (text: string) => void; lang?: string }) {
  const lang = opts.lang ?? 'es-ES';
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const onFinalRef = useRef(opts.onFinal);

  useEffect(() => {
    onFinalRef.current = opts.onFinal;
  }, [opts.onFinal]);

  // Solo verifica soporte en montaje; no mantiene instancia persistente.
  useEffect(() => {
    if (!getSpeechCtor()) setSupported(false);
    return () => {
      // Abortar sesión activa al desmontar
      try {
        recRef.current?.abort();
      } catch {
        // ya detenido
      }
      recRef.current = null;
      setListening(false);
    };
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechCtor();
    if (!Ctor) return;

    // Abortar sesión anterior si existiera
    try {
      recRef.current?.abort();
    } catch {
      // ya detenido
    }

    // Instancia fresca en cada sesión (evita bug de Chrome con instancias reutilizadas)
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e) => {
      let finalText = '';
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const transcript = res[0].transcript;
        if (res.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setInterim(interimText);
      if (finalText.trim()) {
        setInterim('');
        onFinalRef.current(finalText.trim());
      }
    };

    rec.onerror = (e) => {
      const msg = mapError(e.error);
      if (msg) setError(msg);
      setListening(false);
    };

    rec.onend = () => setListening(false);

    setError(null);
    setInterim('');

    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch {
      setError('Error al iniciar el micrófono. Intenta de nuevo.');
    }
  }, [lang]);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      // ya detenido
    }
    setListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find((v) => v.lang === lang) ??
          voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
        if (preferred) utterance.voice = preferred;
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        trySpeak();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true });
      }
    },
    [lang],
  );

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { supported, listening, interim, error, start, stop, speak, cancelSpeech };
}
