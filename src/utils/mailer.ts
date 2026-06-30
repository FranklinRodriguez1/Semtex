import nodemailer from 'nodemailer';

interface SendMailOptions {
  fromEmail: string;
  accessCode: string;
  to: string;
  subject: string;
  body: string;
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
  });
}
