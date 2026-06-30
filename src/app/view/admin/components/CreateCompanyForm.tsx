"use client";

import { useState } from "react";
import { createCompany } from "../services/admin";

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
        {props.label}
      </label>
      <input
        type={props.type ?? "text"}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
      />
    </div>
  );
}

export function CreateCompanyForm({ onCreated }: { onCreated: () => void }) {
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      const res = await createCompany({ companyName, adminEmail, adminPassword });
      setOk(`Empresa "${res.companyName}" creada. Admin: ${res.email}. Entrégale sus credenciales.`);
      setCompanyName("");
      setAdminEmail("");
      setAdminPassword("");
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 p-6"
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#06B6D4]">
        Crear empresa + admin
      </p>
      <Field label="Nombre de la empresa" value={companyName} onChange={setCompanyName} placeholder="Ferretería López" />
      <Field label="Email del admin" type="email" value={adminEmail} onChange={setAdminEmail} placeholder="admin@ferreteria.com" />
      <Field label="Contraseña temporal" type="password" value={adminPassword} onChange={setAdminPassword} placeholder="••••••••" />

      {error && (
        <p className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-[11px] text-[#EF4444]">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-2 text-[11px] text-[#22C55E]">
          {ok}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#06B6D4] py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "CREANDO..." : "CREAR EMPRESA + ADMIN"}
      </button>
    </form>
  );
}
