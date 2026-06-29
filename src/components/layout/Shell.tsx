"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

// Rutas que NO deben mostrar el sidebar (pantallas de autenticación).
const FULLSCREEN_ROUTES = ["/view/loginy"];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_ROUTES.some((p) => pathname?.startsWith(p));

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
