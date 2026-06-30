import { supabase } from "./supabase";

export async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export interface Claims {
  sub: string;
  email?: string;
  org_id?: string;
  /** El hook de Supabase puede inyectar el rol como "app_role" o como "role". */
  app_role?: string;
  role?: string;
}

/**
 * Devuelve el rol normalizado desde los claims del JWT, independientemente de si el
 * hook de Supabase lo inyectó como "app_role" o como "role".
 * En Render: si el backend usa semtex.jwt.role-claim=role (defecto), el hook debe
 * inyectar el claim como "role". Si usa "app_role", configurar semtex.jwt.role-claim=app_role.
 */
export function getRoleFromClaims(claims: Claims | null): string | undefined {
  return claims?.app_role ?? claims?.role ?? undefined;
}

/** Decodifica (sin verificar) los claims del JWT de la sesión actual. */
export async function getClaims(): Promise<Claims | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload)))) as Claims;
  } catch {
    return null;
  }
}

/** GET a una ruta interna de Next (/api/...) con el Bearer de Supabase. */
export async function getInternal<T = unknown>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message ?? `Error ${res.status}`,
    );
  }
  return data as T;
}

/** POST a una ruta interna de Next (/api/...) con el Bearer de Supabase. */
export async function postInternal<T = unknown>(
  path: string,
  body: unknown,
): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
