// Root catch-all: serve SPA for non-API routes
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

  // API routes are handled by functions/api/* — pass through
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }

  // All other routes: serve the SPA
  return context.next();
};
