import nodemailer from 'nodemailer';
import { createClient } from '@libsql/client';
import crypto from 'crypto';

function getDb() {
  const url = process.env.TURSO_CONNECTION_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('Turso not configured');
  return createClient({ url, authToken });
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const db = getDb();
    const token = crypto.randomBytes(32).toString('hex');
    // Use SQLite-compatible datetime format (no T/Z)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '')
      .split('.')[0];

    await db.execute('DELETE FROM password_reset_tokens WHERE email = ?', [email]);
    await db.execute(
      'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
      [email, token, expiresAt]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'https://main.author-fatima-76r-eis.pages.dev';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Author FSK" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:30px;">
          <h2 style="color:#333;">Password Reset</h2>
          <p style="color:#555;">Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#667eea;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#888;font-size:13px;">Expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    console.log(`[forgot-password] Reset email sent to ${email}`);
    return res.json({ success: true, message: 'Reset link sent to your email.' });
  } catch (err) {
    console.error('[forgot-password] Error:', err.message);
    return res.status(500).json({ error: 'Failed to send reset email', details: err.message });
  }
}
