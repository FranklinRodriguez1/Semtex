import { notFound } from "next/navigation";
import type { ReactNode } from "react";

/** Bloquea toda la ruta /dev/* en producción. */
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <>{children}</>;
}
