/**
 * Cloudflare Worker Email Proxy
 * 
 * This worker proxies email requests to the backend Node.js server.
 * It handles CORS and forwards requests to the configured BACKEND_URL.
 * 
 * Architecture:
 * Frontend (Cloudflare Pages) 
 *   ↓ 
 * Cloudflare Worker (this file)
 *   ↓
 * Backend Server (Node.js + Nodemailer)
 *   ↓
 * Gmail SMTP
 */

interface Env {
  BACKEND_URL: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle CORS preflight requests
 */
function handleCors(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  return null;
}

/**
 * Proxy request to backend server
 */
async function proxyToBackend(
  request: Request,
  backendUrl: string,
  pathname: string
): Promise<Response> {
  try {
    // Build the full backend URL
    const url = new URL(pathname, backendUrl);
    
    // Copy request headers
    const headers = new Headers(request.headers);
    
    // Forward the request to backend
    const backendResponse = await fetch(url.toString(), {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.text() 
        : undefined,
    });

    // Get response body
    const body = await backendResponse.text();

    // Return response with CORS headers
    return new Response(body, {
      status: backendResponse.status,
      headers: {
        ...Object.fromEntries(backendResponse.headers),
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Backend proxy error:', error);
    return new Response(
      JSON.stringify({
        error: 'Backend server error',
        details: error.message,
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) {
      return corsResponse;
    }

    // Get backend URL from environment
    const backendUrl = env.BACKEND_URL;
    if (!backendUrl) {
      return new Response(
        JSON.stringify({
          error: 'Backend URL not configured',
          message: 'Set BACKEND_URL in wrangler.toml',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get request pathname
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Log request
    console.log(`[PROXY] ${request.method} ${pathname} → ${backendUrl}${pathname}`);

    // Proxy to backend
    return proxyToBackend(request, backendUrl, pathname);
  },
};
