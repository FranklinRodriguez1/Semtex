"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "./Sidebar";

const FULLSCREEN_ROUTES = ["/view/loginy"];

function LoadingScreen() {
  return (
    <main className="flex h-full w-full items-center justify-center overflow-y-auto">
      <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/80 px-6 py-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#74f5ff]">
          Validando acceso
        </p>
        <p className="mt-2 text-[10px] tracking-[0.18em] text-[#b9cacb]">
          Verificando sesión del usuario...
        </p>
      </div>
    </main>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isChecking, isAuthenticated } = useAuth();
  const isFullscreen = FULLSCREEN_ROUTES.some((p) => pathname?.startsWith(p));
  const isProtectedRoute = !!pathname && pathname.startsWith("/view/") && !isFullscreen;

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (isProtectedRoute && !isAuthenticated) {
    return <LoadingScreen />;
  }

  if (isFullscreen) {
    return <main className="h-full w-full overflow-y-auto">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto pl-64">{children}</main>
    </>
  );
}
