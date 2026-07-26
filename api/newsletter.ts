import type { VercelRequest, VercelResponse } from '@vercel/node';

const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  // In a real production app, replace this with a proper email provider or database write.
  // For now, simply simulate success and optionally log received emails.
  console.log('Newsletter signup:', email);

  return res.status(200).json({ success: true, email });
}
