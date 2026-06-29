import { supabaseAdmin, getCaller, isSuperAdmin } from "@/lib/supabaseAdmin";

/**
 * POST /api/admin/companies — el SUPER-ADMIN de la plataforma crea una empresa
 * nueva junto a su usuario ADMIN. Sin organization_id en el metadata, el trigger
 * de Supabase crea la organización y marca al usuario como ADMIN.
 *
 * Body: { companyName, adminEmail, adminPassword }
 */
export async function POST(request: Request) {
  const caller = await getCaller(request);
  if (!caller) {
    return Response.json({ message: "No autenticado." }, { status: 401 });
  }
  if (!isSuperAdmin(caller.email)) {
    return Response.json(
      { message: "Solo el super-admin de la plataforma puede crear empresas." },
      { status: 403 },
    );
  }

  let body: { companyName?: string; adminEmail?: string; adminPassword?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "JSON inválido." }, { status: 400 });
  }

  const companyName = body.companyName?.trim();
  const adminEmail = body.adminEmail?.trim();
  const adminPassword = body.adminPassword;

  if (!companyName || !adminEmail || !adminPassword) {
    return Response.json(
      { message: "companyName, adminEmail y adminPassword son obligatorios." },
      { status: 400 },
    );
  }
  if (adminPassword.length < 6) {
    return Response.json(
      { message: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // alta directa, sin verificación por correo
    user_metadata: { company_name: companyName },
  });

  if (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }

  return Response.json(
    { userId: data.user?.id, email: data.user?.email, companyName },
    { status: 201 },
  );
}
