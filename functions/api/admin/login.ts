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

// Simple JWT-like token using base64 + HMAC via Web Crypto
async function makeToken(payload: object, secret: string, expiresInSec: number) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const data = btoa(JSON.stringify({ ...payload, exp }));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${data}.${sigB64}`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { email, password } = await request.json();
    if (!email || !password) return json({ error: 'Email and password required' }, 400);

    const url = env.TURSO_CONNECTION_URL;
    const authToken = env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) return json({ error: 'Database not configured' }, 500);

    const db = createClient({ url, authToken });
    const result = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);

    if (result.rows.length === 0) return json({ error: 'Invalid credentials' }, 401);

    const admin = result.rows[0] as any;

    // Verify password with bcrypt via dynamic import
    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return json({ error: 'Invalid credentials' }, 401);

    const secret = env.JWT_SECRET || env.GMAIL_APP_PASSWORD || 'secret-key';
    const accessToken = await makeToken({ id: admin.id, email: admin.email }, secret, 3600);
    const refreshToken = await makeToken({ id: admin.id, email: admin.email, type: 'refresh' }, secret, 86400 * 7);

    return json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return json({ error: err.message || 'Login failed' }, 500);
  }
}
