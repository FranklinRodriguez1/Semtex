import nodemailer from 'nodemailer';

interface SendMailOptions {
  fromEmail: string;
  accessCode: string;
  to: string;
  subject: string;
  body: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtmlBody(subject: string, body: string): string {
  const safeSubject = escapeHtml(subject);
  const safeBody = escapeHtml(body).replace(/\n/g, '<br />');

  return `
<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background-color:#090b12; font-family:'Segoe UI', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#090b12; padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#0F172A; border-radius:16px; overflow:hidden; border:1px solid #1e293b;">
            <tr>
              <td style="background:linear-gradient(90deg, #06B6D4, #00dbe7); padding:24px 32px;">
                <p style="margin:0; font-size:11px; letter-spacing:4px; color:#00363a; font-weight:700; text-transform:uppercase;">TACTICAL MANAGEMENT SYSTEM</p>
                <h1 style="margin:6px 0 0; font-size:28px; letter-spacing:2px; color:#00363a; font-weight:900; text-transform:uppercase;">SEMTEX</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 8px; font-size:11px; letter-spacing:2px; color:#F97316; text-transform:uppercase; font-weight:700;">Asunto</p>
                <h2 style="margin:0 0 24px; font-size:20px; color:#E5E1E4; font-weight:700;">${safeSubject}</h2>
                <div style="font-size:15px; line-height:1.7; color:#b9cacb;">${safeBody}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; background-color:#0e0e10; border-top:1px solid #1e293b;">
                <p style="margin:0; font-size:12px; letter-spacing:1px; color:#3a494b;">Correo enviado desde <span style="color:#06B6D4; font-weight:700;">SEMTEX</span></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendMail(opts: SendMailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: opts.fromEmail,
      pass: opts.accessCode,
    },
  });

  await transporter.sendMail({
    from: opts.fromEmail,
    to: opts.to,
    subject: opts.subject,
    text: opts.body,
    html: buildHtmlBody(opts.subject, opts.body),
  });
}
