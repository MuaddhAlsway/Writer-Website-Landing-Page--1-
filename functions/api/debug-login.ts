import { createClient } from '@libsql/client';

const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const { email, password } = await request.json();

  const db = createClient({ url: env.TURSO_CONNECTION_URL, authToken: env.TURSO_AUTH_TOKEN });
  const result = await db.execute('SELECT password FROM admins WHERE email = ?', [email]);

  if (result.rows.length === 0) {
    return new Response(JSON.stringify({ error: 'user not found' }), { headers: cors });
  }

  const storedHash = result.rows[0].password as string;
  const startsWithPbkdf2 = storedHash.startsWith('pbkdf2:');
  const parts = storedHash.split(':');

  let computedHash = '';
  let match = false;

  if (startsWithPbkdf2 && parts.length >= 3) {
    const salt = parts[1];
    const expectedHash = parts.slice(2).join(':'); // handle colons in hash
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
      keyMaterial, 256
    );
    computedHash = btoa(String.fromCharCode(...new Uint8Array(bits)));
    match = computedHash === expectedHash;
  }

  return new Response(JSON.stringify({
    startsWithPbkdf2,
    parts: parts.length,
    salt: parts[1],
    storedHashPart: parts.slice(2).join(':').substring(0, 20) + '...',
    computedHash: computedHash.substring(0, 20) + '...',
    match,
  }), { headers: cors });
}
