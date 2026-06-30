import { supabaseAdmin, getCaller, isSuperAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/admin/companies/[id]/users — usuarios de una organización concreta.
 * Solo el super-admin puede consultarla (usa service_role, ignora RLS/tenant).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const caller = await getCaller();
  if (!caller) {
    return Response.json({ message: "No autenticado." }, { status: 401 });
  }
  if (!isSuperAdmin(caller.email)) {
    return Response.json(
      { message: "Solo el super-admin de la plataforma puede ver estos usuarios." },
      { status: 403 },
    );
  }

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, role, is_active, last_login_at, created_at")
    .eq("organization_id", id)
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
