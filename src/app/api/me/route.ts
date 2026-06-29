import { getCaller, getCallerProfile, isSuperAdmin } from "@/lib/supabaseAdmin";

/** GET /api/me — identidad del usuario actual para adaptar la UI. */
export async function GET(request: Request) {
  const caller = await getCaller(request);
  if (!caller) {
    return Response.json({ message: "No autenticado." }, { status: 401 });
  }
  const profile = await getCallerProfile(caller.id);
  return Response.json({
    email: caller.email,
    isSuperAdmin: isSuperAdmin(caller.email),
    role: profile?.role ?? null,
    organizationId: profile?.organizationId ?? null,
  });
}
