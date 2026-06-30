import { supabaseAdmin, getCaller, getCallerProfile } from '@/lib/supabaseAdmin';

/** GET /api/config/email — devuelve el correo SMTP configurado para la org (nunca la contraseña). */
export async function GET(request: Request) {
  const caller = await getCaller(request);
  if (!caller) return Response.json({ message: 'No autenticado.' }, { status: 401 });

  const profile = await getCallerProfile(caller.id);
  if (!profile) return Response.json({ fromEmail: null, password: null });

  const { data, error } = await supabaseAdmin
    .from('organizations')
    .select('smtp_email')
    .eq('id', profile.organizationId)
    .single();

  if (error) return Response.json({ fromEmail: null, password: null });

  return Response.json({ fromEmail: (data as { smtp_email: string | null })?.smtp_email ?? null, password: null });
}

/** PUT /api/config/email — guarda correo y contraseña SMTP de la org. Solo admin. */
export async function PUT(request: Request) {
  const caller = await getCaller(request);
  if (!caller) return Response.json({ message: 'No autenticado.' }, { status: 401 });

  const profile = await getCallerProfile(caller.id);
  if (!profile) return Response.json({ message: 'Organización no encontrada.' }, { status: 404 });

  if (profile.role !== 'admin') {
    return Response.json({ message: 'Solo los administradores pueden configurar el correo.' }, { status: 403 });
  }

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
    .from('organizations')
    .update({ smtp_email: body.fromEmail.trim(), smtp_password: body.password.trim() })
    .eq('id', profile.organizationId);

  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ message: 'Configuración guardada.' });
}
