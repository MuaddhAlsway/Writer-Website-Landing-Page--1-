const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Proxy to Vercel backend which uses Gmail SMTP + nodemailer
  // Always fall back to production Vercel URL (never localhost)
  const rawBackend = env.BACKEND_URL || '';
  const backendUrl = rawBackend.startsWith('http://localhost')
    ? 'https://writer-website-landing-page-1.vercel.app/api'
    : rawBackend || 'https://writer-website-landing-page-1.vercel.app/api';

  try {
    const resp = await fetch(`${backendUrl}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return json(data, resp.ok ? 200 : resp.status);
  } catch (err: any) {
    return json({ success: false, error: err.message || 'Failed to reach email backend' }, 502);
  }
}
