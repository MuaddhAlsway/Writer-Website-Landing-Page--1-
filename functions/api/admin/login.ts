import { createClient } from '@libsql/client';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

// PBKDF2 hash using Web Crypto (CF Workers compatible)
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // storedHash format: "pbkdf2:<salt>:<hash>"
  if (!storedHash.startsWith('pbkdf2:')) return false;
  const [, salt, hash] = storedHash.split(':');
  const computed = await hashPassword(password, salt);
  return computed === hash;
}

async function makeToken(payload: object, secret: string, expiresInSec: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const data = btoa(JSON.stringify({ ...payload, exp }));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { email, password } = await request.json();
    if (!email || !password) return json({ error: 'Email and password required' }, 400);
    if (password.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);

    if (!env.TURSO_CONNECTION_URL || !env.TURSO_AUTH_TOKEN) {
      return json({ error: 'Database not configured' }, 500);
    }

    const db = createClient({ url: env.TURSO_CONNECTION_URL, authToken: env.TURSO_AUTH_TOKEN });
    const result = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (result.rows.length === 0) return json({ error: 'Invalid credentials' }, 401);

    const admin = result.rows[0] as any;
    const valid = await verifyPassword(password, admin.password);
    if (!valid) return json({ error: 'Invalid credentials' }, 401);

    const secret = env.JWT_SECRET || 'jwt-secret-key-author-fsk';
    const accessToken = await makeToken({ id: admin.id, email: admin.email }, secret, 3600);
    const refreshToken = await makeToken({ id: admin.id, email: admin.email, type: 'refresh' }, secret, 86400 * 7);

    return json({ success: true, accessToken, refreshToken, expiresIn: 3600, user: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err: any) {
    console.error('Login error:', err);
    return json({ error: err.message || 'Login failed' }, 500);
  }
}
