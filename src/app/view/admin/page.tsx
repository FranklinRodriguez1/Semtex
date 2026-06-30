"use client";

import { useCallback, useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  createCompany,
  listCompanies,
  listCompanyUsers,
  type Company,
  type CompanyUser,
} from "./services/admin";

export default function SuperAdminPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadCompanies = useCallback(async () => {
    try {
      const data = await listCompanies();
      setCompanies(data);
      setListError(null);
    } catch (err) {
      setListError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const data = await listCompanies().catch((err) => {
        if (active) setListError((err as Error).message);
        return null;
      });
      if (active && data) setCompanies(data);
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  return (
    <RoleGuard superAdminOnly>
    <div className="min-h-full bg-[#000000] p-8 text-[#E5E1E4]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-end justify-between border-b border-[#3a494b] pb-4">
          <div>
            <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#06B6D4]">
              Super-Admin · Empresas
            </h1>
            <p className="mt-1 text-[10px] tracking-[0.15em] text-[#3a494b]">
              PLATFORM_PROVISIONING
            </p>
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-xl border border-[#06B6D4]/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#06B6D4] transition hover:bg-[#06B6D4]/10"
          >
            {showCreate ? "Cerrar" : "+ Nueva empresa"}
          </button>
        </div>

        {showCreate && (
          <CreateCompanyForm
            onCreated={() => {
              void loadCompanies();
            }}
          />
        )}

        {selected ? (
          <CompanyUsers
            key={selected.id}
            company={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <CompanyList
            companies={companies}
            error={listError}
            onSelect={setSelected}
          />
        )}
      </div>
    </div>
    </RoleGuard>
  );
}

function CompanyList({
  companies,
  error,
  onSelect,
}: {
  companies: Company[];
  error: string | null;
  onSelect: (c: Company) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40">
      <div className="border-b border-[#3a494b] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
        Organizaciones ({companies.length})
      </div>
      {error ? (
        <p className="p-4 text-[11px] text-[#EF4444]">{error}</p>
      ) : companies.length === 0 ? (
        <p className="p-4 text-[11px] italic text-[#3a494b]">
          Sin empresas aún. Crea la primera.
        </p>
      ) : (
        <ul className="divide-y divide-[#3a494b]/40">
          {companies.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#201f21]"
              >
                <div>
                  <p className="text-[13px] text-[#E5E1E4]">{c.name}</p>
                  <p className="font-mono text-[10px] text-[#3a494b]">{c.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#b9cacb]">
                    {c.userCount} usuarios
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] ${
                      c.isActive
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : "bg-[#EF4444]/10 text-[#EF4444]"
                    }`}
                  >
                    {c.isActive ? "Activa" : "Inactiva"}
                  </span>
                  <span className="text-[#06B6D4]">›</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompanyUsers({
  company,
  onBack,
}: {
  company: Company;
  onBack: () => void;
}) {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listCompanyUsers(company.id)
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err) => {
        if (active) setError((err as Error).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [company.id]);

  return (
    <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40">
      <div className="flex items-center justify-between border-b border-[#3a494b] px-4 py-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          {company.name} · Usuarios ({users.length})
        </div>
        <button
          onClick={onBack}
          className="text-[10px] uppercase tracking-[0.2em] text-[#06B6D4] hover:underline"
        >
          ‹ Volver
        </button>
      </div>
      {loading ? (
        <p className="p-4 text-[11px] italic text-[#3a494b]">Cargando…</p>
      ) : error ? (
        <p className="p-4 text-[11px] text-[#EF4444]">{error}</p>
      ) : users.length === 0 ? (
        <p className="p-4 text-[11px] italic text-[#3a494b]">
          Esta empresa no tiene usuarios.
        </p>
      ) : (
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[#3a494b] text-[9px] uppercase tracking-[0.2em] text-[#3a494b]">
              <th className="px-4 py-2 text-left font-normal">Email</th>
              <th className="px-4 py-2 text-left font-normal">Rol</th>
              <th className="px-4 py-2 text-left font-normal">Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#3a494b]/40">
                <td className="px-4 py-3 font-mono text-[#E5E1E4]">{u.email}</td>
                <td className="px-4 py-3 text-[#b9cacb]">{u.role}</td>
                <td className="px-4 py-3 text-[#b9cacb]">
                  {u.active ? "Activo" : "Inactivo"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CreateCompanyForm({ onCreated }: { onCreated: () => void }) {
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
      const res = await createCompany({
        companyName,
        adminEmail,
        adminPassword,
      });
      setOk(
        `Empresa "${res.companyName}" creada. Admin: ${res.email}. Entrégale sus credenciales.`,
      );
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
      <Field
        label="Nombre de la empresa"
        value={companyName}
        onChange={setCompanyName}
        placeholder="Ferretería López"
      />
      <Field
        label="Email del admin"
        type="email"
        value={adminEmail}
        onChange={setAdminEmail}
        placeholder="admin@ferreteria.com"
      />
      <Field
        label="Contraseña temporal"
        type="password"
        value={adminPassword}
        onChange={setAdminPassword}
        placeholder="••••••••"
      />

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
