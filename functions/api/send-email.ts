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

    // Get Gmail credentials from environment
    const gmailUser = context.env.GMAIL_USER;
    const gmailPassword = context.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error('[EMAIL] Gmail credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[EMAIL] Sending to ${recipients.length} recipients`);

    // Use Resend API if available, otherwise use Gmail via fetch
    const resendApiKey = context.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Use Resend API
      let sent = 0;
      let failed = 0;

      for (const recipient of recipients) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: gmailUser,
              to: recipient,
              subject: subject,
              html: message,
            }),
          });

          if (response.ok) {
            sent++;
          } else {
            failed++;
            console.error(`Failed to send to ${recipient}:`, await response.text());
          }
        } catch (error: any) {
          failed++;
          console.error(`Failed to send to ${recipient}:`, error.message);
        }
      }

      return new Response(
        JSON.stringify({
          success: failed === 0,
          sent,
          failed,
          total: recipients.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Fallback: Use backend API
      const backendUrl = context.env.BACKEND_URL;
      if (!backendUrl) {
        console.warn('[EMAIL] No email service configured - no backend URL');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Email service not configured. Please set RESEND_API_KEY or BACKEND_URL.',
            sent: 0,
            failed: recipients.length,
            total: recipients.length,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      try {
        const response = await fetch(`${backendUrl}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients,
            subject,
            message,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          const error = await response.text();
          console.error('[EMAIL] Backend error:', error);
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Backend email service failed',
              sent: 0,
              failed: recipients.length,
              total: recipients.length,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (error: any) {
        console.error('[EMAIL] Backend request failed:', error.message);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to reach email service',
            sent: 0,
            failed: recipients.length,
            total: recipients.length,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error: any) {
    console.error('[EMAIL] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
