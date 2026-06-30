"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Solo accesible en desarrollo. En prod devuelve 404 (ver layout/guard abajo). */
export default function JwtDebugPage() {
  const [claims, setClaims] = useState<Record<string, unknown> | null>(null);
  const [raw, setRaw] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) {
        setError("No hay sesión activa. Haz login primero.");
        return;
      }

      setRaw(session.access_token);

      try {
        const parts = session.access_token.split(".");
        const payload = JSON.parse(
          decodeURIComponent(escape(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))))
        ) as Record<string, unknown>;
        setClaims(payload);
      } catch {
        setError("No se pudo decodificar el token.");
      }
    });
  }, []);

  const interesting = claims
    ? {
        sub: claims.sub,
        email: claims.email,
        role: claims.role,
        app_role: claims.app_role,
        org_id: claims.org_id,
        organization_id: claims.organization_id,
        user_metadata: claims.user_metadata,
        app_metadata: claims.app_metadata,
        exp: claims.exp
          ? new Date((claims.exp as number) * 1000).toISOString()
          : undefined,
      }
    : null;

  return (
    <div className="min-h-screen bg-[#0F172A] p-8 font-mono text-[#E5E1E4]">
      <h1 className="mb-1 text-xl font-bold text-[#74f5ff]">JWT Claim Inspector</h1>
      <p className="mb-6 text-[11px] text-[#3a494b] uppercase tracking-widest">
        DEV ONLY — ¿qué claims lleva el token de Supabase?
      </p>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {interesting && (
        <>
          <section className="mb-6">
            <h2 className="mb-2 text-[12px] uppercase tracking-widest text-[#06B6D4]">
              Claims relevantes
            </h2>
            <pre className="overflow-auto rounded-lg border border-[#3a494b] bg-[#0e0e10] p-4 text-xs leading-relaxed">
              {JSON.stringify(interesting, null, 2)}
            </pre>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-[12px] uppercase tracking-widest text-[#06B6D4]">
              Diagnóstico
            </h2>
            <DiagBox label='claim "role"' value={claims?.role as string | undefined} />
            <DiagBox label='claim "app_role"' value={claims?.app_role as string | undefined} />
            <DiagBox label='claim "org_id"' value={claims?.org_id as string | undefined} />
            <p className="mt-3 text-[11px] text-[#b9cacb]">
              El backend en Render lee <strong className="text-[#74f5ff]">role</strong> y{" "}
              <strong className="text-[#74f5ff]">org_id</strong>. Si alguno es{" "}
              <span className="text-red-400">undefined</span>, el agente IA y los documentos darán
              403/error de tenant.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[12px] uppercase tracking-widest text-[#06B6D4]">
              Payload completo
            </h2>
            <pre className="overflow-auto rounded-lg border border-[#3a494b] bg-[#0e0e10] p-4 text-xs leading-relaxed">
              {JSON.stringify(claims, null, 2)}
            </pre>
          </section>
        </>
      )}

      {raw && (
        <section className="mt-6">
          <h2 className="mb-2 text-[12px] uppercase tracking-widest text-[#3a494b]">
            Token raw (copiar para jwt.io)
          </h2>
          <textarea
            readOnly
            value={raw}
            className="w-full rounded-lg border border-[#3a494b] bg-[#0e0e10] p-3 text-[10px] text-[#3a494b] outline-none"
            rows={4}
          />
        </section>
      )}
    </div>
  );
}

function DiagBox({ label, value }: { label: string; value: string | undefined }) {
  const present = value !== undefined && value !== null;
  return (
    <div className="mb-1 flex items-center gap-3 text-xs">
      <span
        className={`inline-block w-2 h-2 rounded-full ${present ? "bg-green-400" : "bg-red-500"}`}
      />
      <span className="text-[#b9cacb]">{label}:</span>
      <span className={present ? "text-green-300" : "text-red-400"}>
        {present ? String(value) : "undefined ← PROBLEMA"}
      </span>
    </div>
  );
}
