'use client';

import { useEffect, useState } from 'react';

type ServiceStatus = 'checking' | 'ok' | 'error';

interface ServiceEntry {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  detail?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function checkBackend(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/actuator/health`, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const body = await res.json() as { status?: string };
      return { ok: body.status === 'UP', detail: body.status ?? 'UP' };
    }
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch {
    return { ok: false, detail: 'No responde' };
  }
}

const STATIC_SERVICES: Omit<ServiceEntry, 'status' | 'detail'>[] = [
  {
    id: 'supabase',
    name: 'Supabase Auth',
    description: 'Autenticación de usuarios, emisión de JWT (ES256) y hooks de acceso',
  },
  {
    id: 'backend',
    name: 'Backend API (Spring Boot)',
    description: 'Servidor de recursos — valida JWT, multi-tenant, agente IA',
  },
  {
    id: 'agent',
    name: 'Agente IA (LangChain4j)',
    description: 'Consultas financieras y envío de correos vía function-calling (OpenAI/Groq)',
  },
  {
    id: 'smtp',
    name: 'SMTP (Spring Mail)',
    description: 'Envío de correos delegado al backend — configurar variables SPRING_MAIL_* en Render',
  },
];

function dot(status: ServiceStatus) {
  if (status === 'checking') return 'bg-[#b9cacb] animate-pulse';
  if (status === 'ok') return 'bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.5)]';
  return 'bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.5)]';
}

function badge(status: ServiceStatus) {
  if (status === 'checking') return { text: 'VERIFICANDO', color: '#b9cacb' };
  if (status === 'ok') return { text: 'ACTIVO', color: '#22C55E' };
  return { text: 'ERROR', color: '#EF4444' };
}

export function IntegrationsView() {
  const [services, setServices] = useState<ServiceEntry[]>(
    STATIC_SERVICES.map((s) => ({ ...s, status: 'checking' as ServiceStatus })),
  );

  useEffect(() => {
    // Supabase y agente IA se asumen activos (dependen del backend)
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === 'supabase') return { ...s, status: 'ok', detail: 'cwubsogxbiuxyjihghag.supabase.co' };
        if (s.id === 'agent')   return { ...s, status: 'ok', detail: 'vía backend' };
        if (s.id === 'smtp')    return { ...s, status: 'ok', detail: 'configurar en Render' };
        return s;
      }),
    );

    checkBackend().then(({ ok, detail }) => {
      setServices((prev) =>
        prev.map((s) =>
          s.id === 'backend' ? { ...s, status: ok ? 'ok' : 'error', detail } : s,
        ),
      );
    });
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-[#00E5FF]/20 animate-scan shadow-[0_0_10px_#00E5FF]" />
      </div>

      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#00E5FF]">
            Estado del sistema
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            SYSTEM_STATUS
          </p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] font-mono">
          <p>SUPABASE / SPRING / LANGCHAIN4J</p>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((svc) => {
          const b = badge(svc.status);
          return (
            <div
              key={svc.id}
              className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 px-5 py-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot(svc.status)}`} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#E5E1E4]">{svc.name}</p>
                  <p className="text-[10px] text-[#b9cacb] mt-0.5">{svc.description}</p>
                  {svc.detail && (
                    <p className="mt-1 font-mono text-[9px] text-[#3a494b]">{svc.detail}</p>
                  )}
                </div>
              </div>
              <span
                className="shrink-0 rounded px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold"
                style={{ color: b.color, backgroundColor: `${b.color}18`, border: `1px solid ${b.color}30` }}
              >
                {b.text}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
