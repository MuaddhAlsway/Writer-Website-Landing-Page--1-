const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
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

async function makeToken(payload: object, secret: string, expiresInSec: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const data = btoa(JSON.stringify({ ...payload, exp }));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { refreshToken } = await request.json();
    if (!refreshToken) return json({ error: 'Refresh token required' }, 400);

    const secret = env.JWT_SECRET || 'jwt-secret-key-author-fsk';
    const payload = await verifyToken(refreshToken, secret);
    if (!payload || payload.type !== 'refresh') return json({ error: 'Invalid or expired refresh token' }, 401);

    const accessToken = await makeToken({ id: payload.id, email: payload.email }, secret, 3600);
    return json({ success: true, accessToken, expiresIn: 3600 });
  } catch (err: any) {
    return json({ error: err.message || 'Refresh failed' }, 500);
  }
}
