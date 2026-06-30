'use client';

import { useState } from 'react';

interface EmailViewProps {
  userEmail: string;
}

const STORAGE_KEY = 'semtex_mail_credentials';

export function EmailView({ userEmail }: EmailViewProps) {
  const [accessCode, setAccessCode] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!accessCode.trim()) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ fromEmail: userEmail, accessCode: accessCode.trim() }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
            Correo electrónico
          </label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#3a494b] outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
            Código de acceso (contraseña de app)
          </label>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="••••••••••••••••"
            className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          />
          <p className="text-[10px] text-[#3a494b] pt-1">
            Genera una contraseña de aplicación en tu cuenta de Gmail → Seguridad → Verificación en dos pasos.
          </p>
        </div>

        {saved && (
          <p className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-2 text-[11px] text-[#22C55E]">
            Credenciales guardadas para esta sesión.
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={!accessCode.trim()}
          className="w-full rounded-xl bg-[#06B6D4] py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export function getMailCredentials(): { fromEmail: string; accessCode: string } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { fromEmail: string; accessCode: string };
  } catch {
    return null;
  }
}
