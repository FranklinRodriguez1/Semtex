import { supabase } from "./supabase";

export interface Claims {
  sub: string;
  email?: string;
  org_id?: string;
  app_role?: string;
}

/** Decodifica (sin verificar) los claims del JWT de la sesión actual. */
export async function getClaims(): Promise<Claims | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload)))) as Claims;
  } catch {
    return null;
  }
}

/**
 * GET a una ruta interna de Next (/api/...).
 * Las cookies de sesión se envían automáticamente en requests del mismo origen.
 */
export async function getInternal<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin" });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message ?? `Error ${res.status}`,
    );
  }
  return data as T;
}

/**
 * POST a una ruta interna de Next (/api/...).
 * Las cookies de sesión se envían automáticamente en requests del mismo origen.
 */
export async function postInternal<T = unknown>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message ?? `Error ${res.status}`,
    );
  }
  return data as T;
}
