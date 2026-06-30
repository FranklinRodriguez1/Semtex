'use client';

interface EmailViewProps {
  userEmail: string;
}

export function EmailView({ userEmail }: EmailViewProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="border-b border-[#3a494b] pb-4">
        <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#06B6D4]">
          Configuración de Correo
        </h1>
        <p className="mt-1 text-[10px] tracking-[0.15em] text-[#3a494b]">
          BACKEND_SMTP_CONFIG
        </p>
      </div>

      <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 p-6 space-y-4">
        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
            Correo asociado a la cuenta
          </label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#3a494b] outline-none"
          />
        </div>

        <div className="rounded-xl border border-[#06B6D4]/20 bg-[#06B6D4]/5 px-4 py-3 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#06B6D4]">
            Envío gestionado por el backend
          </p>
          <p className="text-[11px] text-[#b9cacb] leading-relaxed">
            El envío de correos se delega al agente Semtex. Para configurar el SMTP edita
            las variables de entorno en Render:
          </p>
          <ul className="mt-1 space-y-0.5 font-mono text-[10px] text-[#74f5ff]">
            <li>SPRING_MAIL_HOST</li>
            <li>SPRING_MAIL_PORT</li>
            <li>SPRING_MAIL_USERNAME</li>
            <li>SPRING_MAIL_PASSWORD</li>
            <li>SEMTEX_EMAIL_FROM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
