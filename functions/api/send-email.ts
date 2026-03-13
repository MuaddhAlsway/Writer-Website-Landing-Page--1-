export async function onRequestPost(context: any) {
  try {
    const { recipients, subject, message } = await context.request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Recipients required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Subject and message required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Vercel backend for real email sending
    const backendUrl = context.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('[EMAIL] Backend URL not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[EMAIL] Proxying to backend: ${backendUrl}/send-email`);
    console.log(`[EMAIL] Recipients: ${recipients.length}`);

    // Call Vercel backend
    const backendResponse = await fetch(`${backendUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients,
        subject,
        message,
      }),
    });

    const result = await backendResponse.json();

    console.log(`[EMAIL] Backend response:`, result);

    return new Response(
      JSON.stringify(result),
      { status: backendResponse.status, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[EMAIL] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
