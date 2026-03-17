// This file is now a proxy to the backend
// Cloudflare Pages Functions don't support direct Turso access via context.env
// All requests are routed through the main [[route]].ts proxy

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get backend URL from environment
    let backendUrl = context.env.BACKEND_URL || 'https://writer-website-landing-page-1.vercel.app';
    if (backendUrl.endsWith('/api')) {
      backendUrl = backendUrl.slice(0, -4);
    }

    // Build the full backend URL
    const targetUrl = `${backendUrl}/api/subscribers${url.search}`;

    console.log(`Proxying ${request.method} /api/subscribers to ${targetUrl}`);

    // Get request body if it exists
    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    // Create a new request with the same method, headers, and body
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: body || undefined,
    });

    // Fetch from backend
    const response = await fetch(proxyRequest);

    // Clone the response and add CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
  } catch (error: any) {
    console.error('Subscribers proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Proxy error', details: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
