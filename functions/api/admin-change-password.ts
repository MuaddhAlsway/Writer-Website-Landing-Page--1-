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
  if (!storedHash.startsWith('pbkdf2:')) return false;
  const [, salt, hash] = storedHash.split(':');
  const computed = await hashPassword(password, salt);
  return computed === hash;
}

async function newHash(password: string): Promise<string> {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
  const hash = await hashPassword(password, salt);
  return `pbkdf2:${salt}:${hash}`;
}

async function verifyToken(token: string, secret: string): Promise<any> {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
    if (!valid) return null;
    const payload = JSON.parse(atob(data));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const secret = env.JWT_SECRET || 'jwt-secret-key-author-fsk';
    const payload = await verifyToken(authHeader.replace('Bearer ', ''), secret);
    if (!payload) return json({ error: 'Invalid or expired token' }, 401);

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) return json({ error: 'Missing required fields' }, 400);
    if (newPassword.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);

    const db = createClient({ url: env.TURSO_CONNECTION_URL, authToken: env.TURSO_AUTH_TOKEN });
    const result = await db.execute('SELECT * FROM admins WHERE email = ?', [payload.email]);
    if (result.rows.length === 0) return json({ error: 'Admin not found' }, 404);

    const admin = result.rows[0] as any;
    const valid = await verifyPassword(currentPassword, admin.password);
    if (!valid) return json({ error: 'Current password is incorrect' }, 401);

    const hashed = await newHash(newPassword);
    await db.execute("UPDATE admins SET password = ?, updated_at = datetime('now') WHERE email = ?", [hashed, payload.email]);

    return json({ success: true, message: 'Password changed successfully' });
  } catch (err: any) {
    return json({ error: err.message || 'Failed to change password' }, 500);
  }
}
