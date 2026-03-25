import { createClient } from '@libsql/client';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await pbkdf2(password, salt, 100000, 32, 'sha256');
  return `pbkdf2:${salt}:${hash.toString('base64')}`;
}

function getDb() {
  const url = process.env.TURSO_CONNECTION_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('Turso not configured');
  return createClient({ url, authToken });
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  if (req.method === 'GET') {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });

    try {
      const result = await db.execute(
        "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')",
        [token]
      );
      if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });
      return res.json({ success: true, email: result.rows[0].email });
    } catch (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  if (req.method === 'POST') {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    try {
      const result = await db.execute(
        "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')",
        [token]
      );
      if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });

      const { email } = result.rows[0];
      await db.execute('DELETE FROM password_reset_tokens WHERE token = ?', [token]);

      const hashed = await hashPassword(newPassword);
      await db.execute(
        "UPDATE admins SET password = ?, updated_at = datetime('now') WHERE email = ?",
        [hashed, email]
      );

      console.log(`[reset-password] Password updated for ${email}`);
      return res.json({ success: true, message: 'Password reset successfully.' });
    } catch (err) {
      console.error('[reset-password] Error:', err.message);
      return res.status(500).json({ error: 'Reset failed', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
