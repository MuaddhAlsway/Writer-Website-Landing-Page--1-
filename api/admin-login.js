import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';
import crypto from 'crypto';

function getDb() {
  return createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

function makeToken(payload, secret, expiresInSec) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

async function verifyPassword(password, storedHash) {
  // Handle bcrypt (from Vercel reset-password)
  if (storedHash.startsWith('$2')) {
    return bcrypt.compare(password, storedHash);
  }
  // Handle PBKDF2 (from CF change-password)
  if (storedHash.startsWith('pbkdf2:')) {
    const [, salt, hash] = storedHash.split(':');
    const result = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, key) => {
        if (err) reject(err);
        else resolve(key.toString('base64'));
      });
    });
    return result === hash;
  }
  return false;
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

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const ALLOWED = ['muaddhalsway@gmail.com', 'authorfsk@gmail.com'];
  if (!ALLOWED.includes(email.toLowerCase())) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = result.rows[0];
    const valid = await verifyPassword(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET || 'jwt-secret-key-author-fsk';
    const accessToken = makeToken({ id: admin.id, email: admin.email }, secret, 3600);
    const refreshToken = makeToken({ id: admin.id, email: admin.email, type: 'refresh' }, secret, 86400 * 7);

    return res.json({
      success: true, accessToken, refreshToken, expiresIn: 3600,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}
