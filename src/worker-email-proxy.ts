/**
 * Cloudflare Worker - Email Proxy
 * 
 * This worker acts ONLY as a proxy to the backend email server.
 * It does NOT attempt to send SMTP emails directly.
 * 
 * Architecture:
 * Frontend (Cloudflare Pages)
 *   ↓
 * Cloudflare Worker (this file)
 *   ↓
 * Node.js Backend Server (emailServer.mjs)
 *   ↓
 * Nodemailer + Gmail SMTP
 *   ↓
 * Gmail Inbox
 */

interface EmailRequest {
  recipients: string[];
  subject: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  sent?: number;
  failed?: number;
  total?: number;
  error?: string;
  errors?: Array<{ recipient: string; error: string }>;
}

/**
 * Handle POST requests to /api/send-email
 * Proxy to backend email server
 */
export async function onRequestPost(context: any): Promise<Response> {
  try {
    const backendUrl = context.env.BACKEND_URL;

    if (!backendUrl) {
      console.error('[WORKER] BACKEND_URL not configured in wrangler.toml');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Backend server not configured',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    let body: EmailRequest;
    try {
      body = await context.request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate request
    if (!body.recipients || !Array.isArray(body.recipients)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Recipients must be an array',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.subject || !body.message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Subject and message are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`[WORKER] Proxying email request to ${backendUrl}`);
    console.log(`[WORKER] Recipients: ${body.recipients.length}`);
    console.log(`[WORKER] Subject: ${body.subject}`);

    // Proxy request to backend server
    const backendResponse = await fetch(`${backendUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Parse backend response
    const responseData: EmailResponse = await backendResponse.json();

    console.log(`[WORKER] Backend response status: ${backendResponse.status}`);
    console.log(`[WORKER] Backend response:`, responseData);

    // Return backend response to client
    return new Response(JSON.stringify(responseData), {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    console.error('[WORKER] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Worker error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle GET requests for health check
 */
export async function onRequestGet(context: any): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'email-proxy-worker',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function onRequestOptions(context: any): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
