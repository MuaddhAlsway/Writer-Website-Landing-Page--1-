// This file is now a proxy to the backend
// Cloudflare Pages Functions don't support direct Turso access via context.env
// All requests are routed through the main [[route]].ts proxy

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Get backend URL from environment
    let backendUrl = context.env.BACKEND_URL || 'https://writer-website-landing-page-1.vercel.app';
    if (backendUrl.endsWith('/api')) {
      backendUrl = backendUrl.slice(0, -4);
    }

    // Build the full backend URL
    const targetUrl = `${backendUrl}/api/stats${url.search}`;

    console.log(`Proxying ${request.method} /api/stats to ${targetUrl}`);

    // Create a new request with the same method and headers
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
    });

    // Fetch from backend
    const response = await fetch(proxyRequest);

    // Clone the response and add CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
  } catch (error: any) {
    console.error('Stats proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Proxy error', details: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
