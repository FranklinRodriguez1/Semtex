import { supabaseAdmin, getCaller, getCallerProfile } from "@/lib/supabaseAdmin";

/**
 * GET /api/users — lista todos los usuarios de la organización del caller.
 * Solo ADMIN: administrar el equipo es su responsabilidad, no la del OPERATOR.
 */
export async function GET(request: Request) {
  const caller = await getCaller(request);
  if (!caller) {
    return Response.json({ message: "No autenticado." }, { status: 401 });
  }

  const profile = await getCallerProfile(caller.id);
  if (!profile) {
    return Response.json({ message: "Perfil no encontrado." }, { status: 403 });
  }
  if (profile.role !== "ADMIN") {
    return Response.json(
      { message: "Solo un ADMIN puede ver el listado de usuarios." },
      { status: 403 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, role, is_active, last_login_at, created_at")
    .eq("organization_id", profile.organizationId)
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }

  const users = (data ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    active: u.is_active,
    lastLoginAt: u.last_login_at,
    createdAt: u.created_at,
  }));

  return Response.json(users);
}
