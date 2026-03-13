export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Forward API requests to backend server
  const backendUrl = context.env.BACKEND_URL || 'http://localhost:3002';
  
  if (path.startsWith('/api/') || path.startsWith('/make-server-53bed28f/')) {
    try {
      const backendResponse = await fetch(`${backendUrl}${path}`, {
        method: context.request.method,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(context.request.headers),
        },
        body: context.request.method !== 'GET' ? await context.request.text() : undefined,
      });

      const responseHeaders = new Headers(backendResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      
      return new Response(backendResponse.body, {
        status: backendResponse.status,
        headers: responseHeaders,
      });
    } catch (err: any) {
      console.error('Backend proxy error:', err);
      return new Response(JSON.stringify({ error: 'Backend unavailable' }), {
        status: 503,
        headers: corsHeaders,
      });
    }
  }

  // If it's not an API route, pass to next handler (static files or SPA)
  return context.next();
};
