import nodemailer from 'nodemailer';

export interface MailOptions {
  fromEmail: string;
  accessCode: string;
  to: string;
  subject: string;
  body: string;
}

export async function sendMail({ fromEmail, accessCode, to, subject, body }: MailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromEmail,
      pass: accessCode,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    text: body,
  });
}
