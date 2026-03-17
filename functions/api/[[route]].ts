export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  // Get the API path (everything after /api/)
  const apiPath = url.pathname.replace('/api/', '');
  
  // Backend URL
  const backendUrl = 'https://writer-website-landing-page-1.vercel.app';
  const targetUrl = `${backendUrl}/api/${apiPath}${url.search}`;
  
  console.log(`Proxying ${request.method} ${url.pathname} to ${targetUrl}`);
  
  try {
    // Create clean headers - DO NOT forward request.headers directly
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Forward only safe headers
    const safeHeaders = ['authorization', 'accept', 'accept-language'];
    for (const [key, value] of request.headers) {
      if (safeHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
    
    // Get request body if it exists
    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }
    
    // Create a new request with clean headers
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: body || undefined,
    });
    
    // Fetch from backend
    const response = await fetch(proxyRequest);
    
    // Clone the response and add CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return newResponse;
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Proxy error', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
