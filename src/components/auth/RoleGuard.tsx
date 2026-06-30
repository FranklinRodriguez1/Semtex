"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getInternal } from "@/lib/session";

interface Me {
  email: string | null;
  isSuperAdmin: boolean;
  role: string | null;
  organizationId: string | null;
}

/**
 * Protege una página por rol. La seguridad REAL la aplica el backend (403);
 * esto es UX: evita que un rol vea una sección que no le corresponde.
 *
 * - `roles`: roles de organización permitidos (ADMIN / OPERATOR).
 * - `superAdminOnly`: solo el super-admin de la plataforma entra.
 * - `superAdminAllowed`: si es true, el super-admin también puede entrar aunque
 *   no tenga un rol de organización (se combina con `roles`).
 */
export function RoleGuard({
  roles,
  superAdminOnly = false,
  superAdminAllowed = false,
  children,
}: {
  roles?: string[];
  superAdminOnly?: boolean;
  superAdminAllowed?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    let active = true;
    async function check() {
      const me = await getInternal<Me>("/api/me").catch(() => null);
      if (!active) return;
      let allowed = false;
      if (me) {
        if (superAdminOnly) {
          allowed = me.isSuperAdmin;
        } else {
          const roleOk = me.role != null && (roles?.includes(me.role) ?? false);
          allowed = roleOk || (superAdminAllowed && me.isSuperAdmin);
        }
      }
      setState(allowed ? "ok" : "denied");
    }
    void check();
    return () => {
      active = false;
    };
  }, [roles, superAdminOnly, superAdminAllowed]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[11px] uppercase tracking-[0.2em] text-[#3a494b]">
        Verificando acceso…
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-center">
        <p className="text-[14px] uppercase tracking-[0.2em] text-[#EF4444]">
          Acceso no autorizado
        </p>
        <p className="max-w-xs text-[11px] text-[#b9cacb]">
          Tu rol no tiene permiso para ver esta sección.
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-xl border border-[#3a494b] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] transition hover:bg-[#201f21]"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
