import { getCaller } from '@/lib/supabaseAdmin';
import { sendMail } from '@/utils/mailer';

export async function POST(request: Request) {
  const caller = await getCaller(request);
  if (!caller) {
    return Response.json({ message: 'No autenticado.' }, { status: 401 });
  }

  let body: { fromEmail?: string; accessCode?: string; to?: string; subject?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'JSON inválido.' }, { status: 400 });
  }

  const { fromEmail, accessCode, to, subject, body: text } = body;

  if (!fromEmail || !accessCode || !to || !subject || !text) {
    return Response.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
  }

  try {
    await sendMail({ fromEmail, accessCode, to, subject, body: text });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ message: (err as Error).message }, { status: 500 });
  }
}
