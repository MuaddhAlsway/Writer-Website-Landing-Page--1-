export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(`[API] ${request.method} ${path}`);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Route to appropriate handler
  if (path.includes('/admin/login')) {
    const { onRequestPost } = await import('./admin/login');
    return onRequestPost(context);
  }

  if (path.includes('/subscribers')) {
    if (request.method === 'GET') {
      const { onRequestGet } = await import('./subscribers');
      return onRequestGet(context);
    }
    if (request.method === 'POST') {
      const { onRequestPost } = await import('./subscribers');
      return onRequestPost(context);
    }
  }

  if (path.includes('/stats')) {
    const { onRequestGet } = await import('./stats');
    return onRequestGet(context);
  }

  if (path.includes('/newsletters') && path.includes('/send')) {
    const { onRequestPost } = await import('./newsletters/send');
    return onRequestPost(context);
  }

  if (path.includes('/newsletters')) {
    if (request.method === 'GET') {
      const { onRequestGet } = await import('./newsletters');
      return onRequestGet(context);
    }
    if (request.method === 'POST') {
      const { onRequestPost } = await import('./newsletters');
      return onRequestPost(context);
    }
  }

  if (path.includes('/send-email')) {
    if (request.method === 'POST') {
      const { onRequestPost } = await import('./send-email');
      return onRequestPost(context);
    }
  }

  // Default 404
  return new Response(
    JSON.stringify({ error: 'Not found' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}
