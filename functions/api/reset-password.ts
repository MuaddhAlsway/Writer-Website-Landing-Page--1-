const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

function getBackendUrl(env: any): string {
  const raw = env.BACKEND_URL || '';
  if (raw.startsWith('http://localhost')) {
    return 'https://writer-website-landing-page-1.vercel.app/api';
  }
  return raw || 'https://writer-website-landing-page-1.vercel.app/api';
}

export const onRequestPost: PagesFunction = async (context: any) => {
  const { request, env } = context;

  try {
    const body = await request.json();
    const backendUrl = getBackendUrl(env);

    const resp = await fetch(`${backendUrl}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return json(data, resp.ok ? 200 : resp.status);
  } catch (err: any) {
    return json({ error: err.message || 'Failed to reach backend' }, 502);
  }
};

export const onRequestGet: PagesFunction = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) return json({ error: 'Token required' }, 400);

  const backendUrl = getBackendUrl(env);

  try {
    const resp = await fetch(`${backendUrl}/reset-password?token=${token}`);
    const data = await resp.json();
    return json(data, resp.ok ? 200 : resp.status);
  } catch (err: any) {
    return json({ error: err.message || 'Failed to reach backend' }, 502);
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: cors });
};
