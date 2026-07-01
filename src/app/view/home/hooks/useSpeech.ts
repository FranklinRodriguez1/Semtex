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

function mapError(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Permiso de micrófono denegado.';
    case 'no-speech':
      return 'No se detectó voz. Intenta de nuevo.';
    case 'audio-capture':
      return 'No se encontró micrófono.';
    default:
      return 'Error de reconocimiento de voz.';
  }
}

/**
 * Reconocimiento de voz (audio → texto) y síntesis (texto → voz) con la Web Speech API.
 * `onFinal` se invoca con el texto transcrito final (desde el evento, no desde un efecto).
 * Requiere contexto seguro (https o localhost) y un navegador compatible (Chrome/Edge).
 */
export function useSpeech(opts: { onFinal: (text: string) => void; lang?: string }) {
  const lang = opts.lang ?? 'es-ES';
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const onFinalRef = useRef(opts.onFinal);
  const manualStopRef = useRef(true);

  useEffect(() => {
    onFinalRef.current = opts.onFinal;
  }, [opts.onFinal]);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    // Continuo: el micrófono se queda encendido escuchando frase tras frase
    // (en vez de apagarse solo al terminar la primera). Se apaga únicamente
    // cuando el usuario dice "terminado" o vuelve a pulsar el botón (stop()).
    rec.continuous = true;
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
        const lower = finalText.toLowerCase();
        const stopIndex = lower.indexOf('terminado');
        if (stopIndex !== -1) {
          const before = finalText.slice(0, stopIndex).trim();
          setInterim('');
          if (before) onFinalRef.current(before);
          manualStopRef.current = true;
          recRef.current?.stop();
          return;
        }
        setInterim('');
        onFinalRef.current(finalText.trim());
      }
    };
    rec.onerror = (e) => {
      setError(mapError(e.error));
      setListening(false);
    };
    rec.onend = () => {
      // Con continuous=true, Chrome igual puede cortar el reconocimiento por
      // silencio prolongado o límites internos; si no fue un apagado manual
      // (botón o "terminado"), lo reactivamos para que siga "prendido".
      if (!manualStopRef.current) {
        try {
          rec.start();
          return;
        } catch {
          // no se pudo reiniciar, se apaga
        }
      }
      setListening(false);
    };
    recRef.current = rec;
    return () => {
      manualStopRef.current = true;
      try {
        rec.abort();
      } catch {
        // ya detenido
      }
      recRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    const rec = recRef.current;
    if (!rec) return;
    setError(null);
    setInterim('');
    manualStopRef.current = false;
    try {
      rec.start();
      setListening(true);
    } catch {
      // ya estaba escuchando
    }
  }, []);

  const stop = useCallback(() => {
    manualStopRef.current = true;
    recRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
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
