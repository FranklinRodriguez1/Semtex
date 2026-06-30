'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface EmailConfig {
  fromEmail: string | null;
  password: string | null;
}

export function EmailView() {
  const [fromEmail, setFromEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    apiFetch<EmailConfig>('/api/config/email')
      .then((cfg) => {
        if (cfg.fromEmail) {
          setFromEmail(cfg.fromEmail);
          setConfigured(true);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    if (!fromEmail.trim() || !password.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch('/api/config/email', {
        method: 'PUT',
        body: JSON.stringify({ fromEmail: fromEmail.trim(), password: password.trim() }),
      });
      setConfigured(true);
      setSaved(true);
      setPassword('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="border-b border-[#3a494b] pb-4">
        <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#06B6D4]">
          Configuración de Correo
        </h1>
        <p className="mt-1 text-[10px] tracking-[0.15em] text-[#3a494b]">
          NODEMAILER_SMTP_CONFIG
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 p-6">
        {configured && (
          <div className="flex items-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
            <p className="text-[11px] text-[#22C55E]">Correo configurado — {fromEmail}</p>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
            Correo Gmail remitente
          </label>
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="tucorreo@gmail.com"
            className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
            Contraseña de aplicación
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={configured ? '••••••••••••••••  (dejar vacío para no cambiar)' : '••••••••••••••••'}
            className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          />
          <p className="pt-1 text-[10px] text-[#3a494b]">
            Genera una contraseña de aplicación en Gmail → Seguridad → Verificación en dos pasos.
            Se guarda en la base de datos de tu organización.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-[11px] text-[#EF4444]">
            {error}
          </p>
        )}

        {saved && (
          <p className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-2 text-[11px] text-[#22C55E]">
            Configuración guardada correctamente.
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !fromEmail.trim() || !password.trim()}
          className="w-full rounded-xl bg-[#06B6D4] py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
