const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function getBackendUrl(env: any): string {
  const raw = env.BACKEND_URL || '';
  if (!raw || raw.startsWith('http://localhost')) {
    return 'https://writer-website-landing-page-1.vercel.app/api';
  }
  return raw;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const backendUrl = getBackendUrl(env);
    const resp = await fetch(`${backendUrl}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { status: resp.status, headers: cors });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 502, headers: cors });
  }
}
