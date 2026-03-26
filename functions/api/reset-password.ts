import { createClient } from '@libsql/client';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

function getDb(env: any) {
  return createClient({ url: env.TURSO_CONNECTION_URL, authToken: env.TURSO_AUTH_TOKEN });
}

async function hashPassword(password: string): Promise<string> {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return `pbkdf2:${salt}:${hash}`;
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: cors });

export const onRequestGet: PagesFunction = async (context: any) => {
  const { request, env } = context;
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return json({ error: 'Token required' }, 400);

  try {
    const db = getDb(env);
    const result = await db.execute(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')",
      [token]
    );
    if (result.rows.length === 0) return json({ error: 'Invalid or expired token' }, 400);
    return json({ success: true, email: result.rows[0].email });
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
};

export const onRequestPost: PagesFunction = async (context: any) => {
  const { request, env } = context;
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) return json({ error: 'Token and new password required' }, 400);
    if (newPassword.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);

    const db = getDb(env);
    const result = await db.execute(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')",
      [token]
    );
    if (result.rows.length === 0) return json({ error: 'Invalid or expired token' }, 400);

    const { email } = result.rows[0] as any;
    await db.execute('DELETE FROM password_reset_tokens WHERE token = ?', [token]);

    const hashed = await hashPassword(newPassword);
    await db.execute(
      "UPDATE admins SET password = ?, updated_at = datetime('now') WHERE email = ?",
      [hashed, email]
    );

    return json({ success: true, message: 'Password reset successfully.' });
  } catch (err: any) {
    return json({ error: err.message || 'Reset failed' }, 500);
  }
};
