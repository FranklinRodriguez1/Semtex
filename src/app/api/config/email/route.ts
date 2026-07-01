import { supabaseAdmin, getCaller, getCallerProfile } from '@/lib/supabaseAdmin';

/**
 * GET /api/config/email — devuelve el correo SMTP configurado por el usuario que llama
 * (nunca la contraseña). Es opcional y por usuario: distinto del correo de login, y cada
 * ADMIN/OPERATOR tiene el suyo — no se comparte a nivel organización.
 */
export async function GET(request: Request) {
  const caller = await getCaller(request);
  if (!caller) return Response.json({ message: 'No autenticado.' }, { status: 401 });

  const profile = await getCallerProfile(caller.id);
  if (!profile) return Response.json({ fromEmail: null, password: null });

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('smtp_email')
    .eq('id', caller.id)
    .maybeSingle();

  if (error) return Response.json({ fromEmail: null, password: null });

  return Response.json({ fromEmail: (data as { smtp_email: string | null } | null)?.smtp_email ?? null, password: null });
}

/** PUT /api/config/email — guarda el correo y contraseña de aplicación propios del usuario (ADMIN u OPERATOR). */
export async function PUT(request: Request) {
  const caller = await getCaller(request);
  if (!caller) return Response.json({ message: 'No autenticado.' }, { status: 401 });

  const profile = await getCallerProfile(caller.id);
  if (!profile) return Response.json({ message: 'Perfil no encontrado.' }, { status: 404 });

  let body: { fromEmail?: string; password?: string };
  try {
    body = await request.json() as { fromEmail?: string; password?: string };
  } catch {
    return Response.json({ message: 'JSON inválido.' }, { status: 400 });
  }

  if (!body.fromEmail?.trim() || !body.password?.trim()) {
    return Response.json({ message: 'fromEmail y password son requeridos.' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ smtp_email: body.fromEmail.trim(), smtp_password: body.password.trim() })
    .eq('id', caller.id);

  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ message: 'Configuración guardada.' });
}
