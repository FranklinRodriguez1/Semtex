import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/utils/mailer';

interface MailBody {
  fromEmail: string;
  accessCode: string;
  to: string;
  subject: string;
  body: string;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as MailBody;

    if (!data.fromEmail || !data.accessCode || !data.to || !data.subject || !data.body) {
      return NextResponse.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
    }

    await sendMail(data);
    return NextResponse.json({ message: 'Correo enviado.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
