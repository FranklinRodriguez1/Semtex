import {
  supabaseAdmin,
  getCaller,
  getCallerProfile,
} from "@/lib/supabaseAdmin";

const ALLOWED_ROLES = ["OPERATOR", "ADMIN"] as const;
type Role = (typeof ALLOWED_ROLES)[number];

/**
 * POST /api/team/invite — un ADMIN da de alta un empleado en SU organización.
 * La organización se toma del perfil del admin autenticado (no del body), así
 * un admin nunca puede crear usuarios en otra empresa.
 *
 * Body: { email, password, role }  (role ∈ OPERATOR | ADMIN)
 */
export async function POST(request: Request) {
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
      { message: "Solo un ADMIN puede agregar empleados." },
      { status: 403 },
    );
  }

  let body: { email?: string; password?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "JSON inválido." }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  const role = (body.role ?? "OPERATOR").toUpperCase();

  if (!email || !password) {
    return Response.json(
      { message: "email y password son obligatorios." },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return Response.json(
      { message: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 },
    );
  }
  if (!ALLOWED_ROLES.includes(role as Role)) {
    return Response.json(
      { message: `Rol inválido. Usa: ${ALLOWED_ROLES.join(", ")}.` },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      organization_id: profile.organizationId, // <-- del admin, no del body
      app_role: role,
    },
  });

  if (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }

  return Response.json(
    { userId: data.user?.id, email: data.user?.email, role },
    { status: 201 },
  );
}
