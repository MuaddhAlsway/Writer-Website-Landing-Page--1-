// Catch-all: serves SPA for all non-API, non-static routes
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Let API routes fall through to their specific function handlers
  // This catch-all should never match /api/* because specific files take priority
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Not found', path: url.pathname }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For all SPA routes, serve index.html
  return context.env.ASSETS.fetch(new Request(new URL('/index.html', url.origin)));
};
