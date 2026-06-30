"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, me } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/view/loginy");
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col justify-between border-r border-[#3a494b] bg-[#131315] px-6 py-8">
      <div className="space-y-3">
        <div>
          <p className="font-bold uppercase text-[1.3rem] tracking-[0.35em] text-[#74f5ff]">SEMTEX</p>
        </div>
        <nav className="space-y-2">
          <Link
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/") || pathname === "/"
                ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4]"
                : "text-[#b9cacb] hover:bg-[#201f21]"
            }`}
            href="/"
          >
            <span className="text-base">⌁</span> Home
          </Link>
          {(me?.role === "ADMIN" || me?.role === "OPERATOR") && (
            <Link
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
                isActive("/view/transfer")
                  ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                  : "text-[#b9cacb] hover:bg-[#201f21]"
              }`}
              href="/view/transfer"
            >
              <span className="text-base">•</span> Upload - Receive
            </Link>
          )}
          {(me?.isSuperAdmin || me?.role === "ADMIN") && (
            <Link
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
                isActive("/view/configuration")
                  ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                  : "text-[#b9cacb] hover:bg-[#201f21]"
              }`}
              href="/view/configuration"
            >
              <span className="text-base">⚙</span> Config
            </Link>
          )}
          {me?.role === "ADMIN" && (
            <Link
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
                isActive("/view/team")
                  ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                  : "text-[#b9cacb] hover:bg-[#201f21]"
              }`}
              href="/view/team"
            >
              <span className="text-base">👥</span> Usuarios
            </Link>
          )}
          {me?.isSuperAdmin && (
            <Link
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
                isActive("/view/admin")
                  ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                  : "text-[#b9cacb] hover:bg-[#201f21]"
              }`}
              href="/view/admin"
            >
              <span className="text-base">🏢</span> Empresas
            </Link>
          )}
          {me?.role === "ADMIN" && (
            <Link
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
                isActive("/view/audit")
                  ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                  : "text-[#b9cacb] hover:bg-[#201f21]"
              }`}
              href="/view/audit"
            >
              <span className="text-base">⚖</span> Audit
            </Link>
          )}
        </nav>
      </div>
      <div className="space-y-2 border-t border-[#3a494b] pt-5">
        {user?.email && (
          <p className="px-4 text-[10px] text-[#b9cacb] truncate" title={user.email}>
            {user.name} · {user.email}
            {me?.isSuperAdmin ? " · SUPER-ADMIN" : me?.role ? ` · ${me.role}` : ""}
          </p>
        )}
        {me?.isSuperAdmin && (
          <Link
            className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]"
            href="/view/configuration"
          >
            <span className="text-base">⚙</span> Settings
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded px-4 py-3 text-left text-sm text-[#b9cacb] hover:bg-[#201f21]"
        >
          <span className="text-base">⏻</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
