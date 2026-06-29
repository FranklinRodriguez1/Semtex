"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getInternal } from "@/lib/session";
import { supabase } from "@/lib/supabase";

interface Me {
  email: string | null;
  isSuperAdmin: boolean;
  role: string | null;
  organizationId: string | null;
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    getInternal<Me>("/api/me")
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

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
          <a
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/") || pathname === "/"
                ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4]"
                : "text-[#b9cacb] hover:bg-[#201f21]"
            }`}
            href="/"
          >
            <span className="text-base">⌁</span> Home
          </a>
          <a
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
              isActive("/view/transfer")
                ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                : "text-[#b9cacb] hover:bg-[#201f21]"
            }`}
            href="/view/transfer"
          >
            <span className="text-base">⬢</span> Upload - Receive
          </a>
          <a
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
              isActive("/view/configuration")
                ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                : "text-[#b9cacb] hover:bg-[#201f21]"
            }`}
            href="/view/configuration"
          >
            <span className="text-base">⚙</span> Config
          </a>
          <a
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
              isActive("/view/team")
                ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                : "text-[#b9cacb] hover:bg-[#201f21]"
            }`}
            href="/view/team"
          >
            <span className="text-base">👥</span> Usuarios
          </a>
          {me?.isSuperAdmin && (
            <a
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
                isActive("/view/admin")
                  ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                  : "text-[#b9cacb] hover:bg-[#201f21]"
              }`}
              href="/view/admin"
            >
              <span className="text-base">🏢</span> Empresas
            </a>
          )}
          <a
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition-colors ${
              isActive("/audit")
                ? "border-l-2 border-[#74f5ff] bg-[#201f21] text-[#E5E1E4] font-semibold"
                : "text-[#b9cacb] hover:bg-[#201f21]"
            }`}
            href="/audit"
          >
            <span className="text-base">⚖</span> Audit
          </a>
        </nav>
      </div>
      <div className="space-y-2 border-t border-[#3a494b] pt-5">
        {me?.email && (
          <p className="px-4 text-[10px] text-[#b9cacb] truncate" title={me.email}>
            {me.email}
            {me.isSuperAdmin ? " · SUPER-ADMIN" : me.role ? ` · ${me.role}` : ""}
          </p>
        )}
        <a
          className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]"
          href="/settings"
        >
          <span className="text-base">⚙</span> Settings
        </a>
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
