"use client";

import { useCallback, useEffect, useState } from "react";
import { getClaims, getRoleFromClaims, type Claims } from "@/lib/session";
import { listUsers, inviteUser, type BackendUser } from "./services/team";

export function TeamContainer() {
  const [claims, setClaims] = useState<Claims | null>(null);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [listError, setListError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OPERATOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setListError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      setListError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const currentClaims = await getClaims();
      if (!active) return;
      setClaims(currentClaims);
      await loadUsers();
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, [loadUsers]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      await inviteUser(email, password, role);
      setOk(`Empleado ${email} agregado como ${role}.`);
      setEmail("");
      setPassword("");
      setRole("OPERATOR");
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = getRoleFromClaims(claims) === "ADMIN";

  return (
    <div className="min-h-full bg-[#000000] p-8 text-[#E5E1E4]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 border-b border-[#3a494b] pb-4">
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#F97316]">
            Usuarios de mi empresa
          </h1>
          <p className="mt-1 text-[10px] tracking-[0.15em] text-[#3a494b]">
            ORG_ID: {claims?.org_id ?? "—"}
          </p>
        </div>

        {!isAdmin && (
          <p className="mb-6 rounded-lg border border-[#F97316]/40 bg-[#F97316]/10 px-3 py-2 text-[11px] text-[#F97316]">
            Solo un ADMIN puede agregar empleados. Tu rol: {getRoleFromClaims(claims) ?? "—"}.
          </p>
        )}

        {isAdmin && (
          <form
            onSubmit={handleInvite}
            className="mb-8 space-y-4 rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 p-6"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9cacb]">
              Agregar empleado
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="empleado@empresa.com"
                  className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none focus:border-[#F97316]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
                  Contraseña temporal
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none focus:border-[#F97316]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none focus:border-[#F97316]"
              >
                <option value="OPERATOR">OPERATOR — sube documentos y usa el chat</option>
                <option value="AUDITOR">AUDITOR — solo lectura y auditoría</option>
                <option value="ADMIN">ADMIN — control total</option>
              </select>
            </div>

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
              className="w-full rounded-xl bg-[#F97316] py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "AGREGANDO..." : "AGREGAR EMPLEADO"}
            </button>
          </form>
        )}

        <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40">
          <div className="border-b border-[#3a494b] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
            Equipo ({users.length})
          </div>
          {listError ? (
            <p className="p-4 text-[11px] text-[#EF4444]">{listError}</p>
          ) : users.length === 0 ? (
            <p className="p-4 text-[11px] italic text-[#3a494b]">Sin usuarios aún.</p>
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
      </div>
    </div>
  );
}
