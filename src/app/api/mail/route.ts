import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/utils/mailer';
import { getCaller, getCallerProfile, supabaseAdmin } from '@/lib/supabaseAdmin';

interface SendBody {
  to: string;
  subject: string;
  body: string;
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json() as SendBody;

    if (!to || !subject || !body) {
      return NextResponse.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const caller = await getCaller(req);
    if (!caller) return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });

    const profile = await getCallerProfile(caller.id);
    if (!profile) {
      return NextResponse.json(
        { message: 'El correo no está configurado. Ve a Configuración → CORREO y guarda tu Gmail y contraseña de app.' },
        { status: 422 },
      );
    }

    const { data } = await supabaseAdmin
      .from('users')
      .select('smtp_email, smtp_password')
      .eq('id', caller.id)
      .maybeSingle();

    const smtpEmail = (data as { smtp_email: string | null; smtp_password: string | null } | null)?.smtp_email ?? null;
    const smtpPassword = (data as { smtp_email: string | null; smtp_password: string | null } | null)?.smtp_password ?? null;

    if (!smtpEmail || !smtpPassword) {
      return NextResponse.json(
        { message: 'El correo no está configurado. Ve a Configuración → CORREO y guarda tu Gmail y contraseña de app.' },
        { status: 422 },
      );
    }

    await sendMail({ fromEmail: smtpEmail, accessCode: smtpPassword, to, subject, body });
    return NextResponse.json({ message: 'Correo enviado.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
