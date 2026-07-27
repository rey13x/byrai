import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS || !process.env.EMAIL_FROM) {
    console.error('Missing email environment variables');
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Terima kasih sudah subscribe',
    text: `Hii ${email},\n\nButuh project baru, mau kolaborasi yuk lanjut diskusi di WhatsApp untuk mendapatkan perhatian cepat. no whatsapp +62 85121579597/Byrai\n\nWebsite: s.id/byrai\n\nSalam hormat,\nRaihaan Bagastiam Pratama`,
    html: `
      <p>Hii <strong>${email}</strong>,</p>
      <p>Butuh project baru, mau kolaborasi yuk lanjut diskusi di WhatsApp untuk mendapatkan perhatian cepat.</p>
      <p><strong>no whatsapp</strong> +62 85121579597 / <strong>Byrai</strong></p>
      <p><strong>Website</strong>: <a href="https://s.id/byrai">s.id/byrai</a></p>
      <p>Salam hormat,</p>
      <p><u>Raihaan Bagastiam Pratama</u></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Newsletter email sent to:', email);
    return res.status(200).json({ success: true, email });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Unable to send email right now.' });
  }
}
