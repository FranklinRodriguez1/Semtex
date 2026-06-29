import { createClient, type User } from "@supabase/supabase-js";

// ⚠️ SOLO SERVIDOR. Este módulo usa la service_role; nunca lo importes en
// componentes con "use client".
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local",
  );
}

/** Cliente con privilegios totales (bypassa RLS). Solo para route handlers. */
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Extrae y valida el Bearer de la request; devuelve el usuario o null. */
export async function getCaller(request: Request): Promise<User | null> {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7)
    : null;
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/** Lee de la BD (fuente de verdad) el rol y la organización del usuario. */
export async function getCallerProfile(
  userId: string,
): Promise<{ organizationId: string; role: string } | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("organization_id, role")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return { organizationId: data.organization_id, role: data.role };
}

export function isSuperAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const list = (process.env.SUPERADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
