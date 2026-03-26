import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const db = createClient({
      url: process.env.TURSO_CONNECTION_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const result = await db.execute('SELECT password FROM admins WHERE email = ?', [email]);
    if (result.rows.length === 0) return res.json({ valid: false });

    const storedHash = result.rows[0].password;
    if (!storedHash.startsWith('$2')) return res.json({ valid: false });

    const valid = await bcrypt.compare(password, storedHash);
    return res.json({ valid });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ valid: false });
  }
}
