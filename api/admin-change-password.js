import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';
import crypto from 'crypto';

function getDb() {
  return createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

function verifyToken(token, secret) {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
    if (expected !== sig) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const secret = process.env.JWT_SECRET || process.env.GMAIL_APP_PASSWORD || 'secret-key';
  const payload = verifyToken(authHeader.replace('Bearer ', ''), secret);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing required fields' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM admins WHERE email = ?', [payload.email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Admin not found' });

    const admin = result.rows[0];
    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await db.execute("UPDATE admins SET password = ?, updated_at = datetime('now') WHERE email = ?", [hashed, payload.email]);

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: err.message || 'Failed to change password' });
  }
}
