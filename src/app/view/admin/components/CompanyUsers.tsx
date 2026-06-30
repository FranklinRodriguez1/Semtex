"use client";

import { useEffect, useState } from "react";
import { listCompanyUsers, type Company, type CompanyUser } from "../services/admin";

export function CompanyUsers({
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
