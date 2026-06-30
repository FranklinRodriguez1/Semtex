'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getHistory, sendMessage, type MessageRole } from './chatService';

export interface UiMessage {
  role: MessageRole;
  content: string;
}

/** Última respuesta del agente recibida por un envío (no por carga de historial). */
export interface LastReply {
  text: string;
  n: number;
}

/**
 * Estado del chat del Home. Carga el historial al montar (si está habilitado)
 * y envía mensajes al agente, mostrando el mensaje del usuario de inmediato.
 */
export function useChat(enabled: boolean) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastReply, setLastReply] = useState<LastReply | null>(null);
  const replyCount = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getHistory()
      .then((history) => {
        if (active) {
          setMessages(history.map((m) => ({ role: m.role, content: m.content })));
        }
      })
      .catch(() => {
        // Sin historial todavía (o aún no autorizado): se ignora en silencio.
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  const send = useCallback(async (content: string, documentId?: string) => {
    const text = content.trim();
    if (!text) return;
    setError(null);
    setMessages((prev) => [...prev, { role: 'USER', content: text }]);
    setSending(true);
    try {
      const res = await sendMessage(text, documentId);
      setMessages((prev) => [...prev, { role: 'ASSISTANT', content: res.agentResponse }]);
      replyCount.current += 1;
      setLastReply({ text: res.agentResponse, n: replyCount.current });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }, []);

  const injectMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { role: 'ASSISTANT' as MessageRole, content }]);
    replyCount.current += 1;
    setLastReply({ text: content, n: replyCount.current });
  }, []);

  return { messages, sending, error, send, lastReply, injectMessage };
}
