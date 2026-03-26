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

async function pbkdf2Hash(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

async function newPbkdf2Hash(password: string): Promise<string> {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const hash = await pbkdf2Hash(password, salt);
  return `pbkdf2:${salt}:${hash}`;
}

async function verifyPbkdf2(password: string, storedHash: string): Promise<boolean> {
  const [, salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const computed = await pbkdf2Hash(password, salt);
  return computed === hash;
}

async function verifyBcryptViaVercel(email: string, password: string): Promise<boolean> {
  try {
    const resp = await fetch('https://writer-website-landing-page-1.vercel.app/api/admin-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) return false;
    const data: any = await resp.json();
    return data.valid === true;
  } catch {
    return false;
  }
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

    const ALLOWED = ['muaddhalsway@gmail.com', 'authorfsk@gmail.com'];
    if (!ALLOWED.includes(email.toLowerCase())) {
      return json({ error: 'Invalid credentials' }, 401);
    }

    const db = createClient({ url: env.TURSO_CONNECTION_URL, authToken: env.TURSO_AUTH_TOKEN });
    const result = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (result.rows.length === 0) return json({ error: 'Invalid credentials' }, 401);

    const admin = result.rows[0] as any;
    let valid = false;

    if (admin.password.startsWith('pbkdf2:')) {
      valid = await verifyPbkdf2(password, admin.password);
    } else if (admin.password.startsWith('$2')) {
      // bcrypt hash — verify via Vercel, then migrate to PBKDF2
      valid = await verifyBcryptViaVercel(email, password);
      if (valid) {
        // Migrate to PBKDF2 so next login is direct
        const newHash = await newPbkdf2Hash(password);
        await db.execute("UPDATE admins SET password = ? WHERE email = ?", [newHash, email]);
      }
    }

    if (!valid) return json({ error: 'Invalid credentials' }, 401);

    const secret = env.JWT_SECRET || 'jwt-secret-key-author-fsk';
    const accessToken = await makeToken({ id: admin.id, email: admin.email }, secret, 3600);
    const refreshToken = await makeToken({ id: admin.id, email: admin.email, type: 'refresh' }, secret, 86400 * 7);

    return json({
      success: true, accessToken, refreshToken, expiresIn: 3600,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return json({ error: err.message || 'Login failed' }, 500);
  }
}
