export const onRequest: PagesFunction = async (context) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { recipients, subject, content, language } = await context.request.json();

    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'Recipients required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Use Mailgun API for email sending
    const mailgunApiKey = context.env.MAILGUN_API_KEY;
    const mailgunDomain = context.env.MAILGUN_DOMAIN;
    const emailFrom = context.env.EMAIL_USER || 'AuthorFSK@gmail.com';

    if (!mailgunApiKey || !mailgunDomain) {
      console.error('Mailgun credentials not configured');
      return new Response(JSON.stringify({ 
        error: 'Email service not configured. Please add MAILGUN_API_KEY and MAILGUN_DOMAIN.' 
      }), {
        status: 503,
        headers: corsHeaders,
      });
    }

    let sentCount = 0;
    const errors: string[] = [];

    // Send to each recipient via Mailgun
    for (const recipient of recipients) {
      try {
        const formData = new FormData();
        formData.append('from', emailFrom);
        formData.append('to', recipient);
        formData.append('subject', subject);
        formData.append('html', content);

        const mailgunResponse = await fetch(
          `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
            },
            body: formData,
          }
        );

        if (mailgunResponse.ok) {
          sentCount++;
          console.log(`✓ Email sent to ${recipient}`);
        } else {
          const error = await mailgunResponse.text();
          console.error(`✗ Failed to send to ${recipient}:`, error);
          errors.push(`${recipient}: Failed to send`);
        }
      } catch (err: any) {
        console.error(`Error sending to ${recipient}:`, err);
        errors.push(`${recipient}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: sentCount > 0,
      message: `Email sent to ${sentCount} recipient(s)`,
      recipientCount: sentCount,
      totalRecipients: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    }), {
      status: sentCount > 0 ? 200 : 500,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Send email error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
