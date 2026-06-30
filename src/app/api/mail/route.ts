import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/utils/mailer';

interface SendBody {
  to: string;
  subject: string;
  body: string;
}

interface EmailConfig {
  fromEmail: string | null;
  password: string | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json() as SendBody;

    if (!to || !subject || !body) {
      return NextResponse.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
    }

    // Forward the user's JWT to retrieve the org's stored SMTP config.
    const authHeader = req.headers.get('Authorization') ?? '';
    const configRes = await fetch(`${BACKEND_URL}/api/config/email`, {
      headers: { Authorization: authHeader },
    });

    if (!configRes.ok) {
      return NextResponse.json(
        { message: 'No se pudo obtener la configuración de correo del servidor.' },
        { status: 502 },
      );
    }

    const config = await configRes.json() as EmailConfig;

    if (!config.fromEmail || !config.password) {
      return NextResponse.json(
        { message: 'El correo no está configurado. Ve a Configuración → CORREO y guarda tu Gmail y contraseña de app.' },
        { status: 422 },
      );
    }

    await sendMail({ fromEmail: config.fromEmail, accessCode: config.password, to, subject, body });
    return NextResponse.json({ message: 'Correo enviado.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
