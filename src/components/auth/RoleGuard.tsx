"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Protege una página por rol. La seguridad REAL la aplica el backend (403);
 * esto es UX: evita que un rol vea una sección que no le corresponde, incluso
 * entrando por URL directa.
 *
 * - `roles`: roles de la organización permitidos (ADMIN/OPERATOR/AUDITOR).
 * - `superAdminOnly`: si es true, solo el super-admin de la plataforma entra.
 *
 * Lee role/isSuperAdmin del AuthProvider (ya cargados en mount) — sin llamadas extra.
 */
export function RoleGuard({
  roles,
  superAdminOnly = false,
  children,
}: {
  roles?: string[];
  superAdminOnly?: boolean;
  children: ReactNode;
}) {
  const { isChecking, isAuthenticated, role, isSuperAdmin } = useAuth();
  const router = useRouter();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[11px] uppercase tracking-[0.2em] text-[#3a494b]">
        Verificando acceso…
      </div>
    );
  }

  const allowed =
    isAuthenticated &&
    (superAdminOnly
      ? isSuperAdmin
      : role != null && (roles?.includes(role) ?? false));

  if (!allowed) {
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
