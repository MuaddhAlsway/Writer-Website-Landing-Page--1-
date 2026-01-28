export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only handle API routes
  if (!pathname.startsWith('/make-server-53bed28f/')) {
    return context.next();
  }

  // Get environment variables
  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  const FROM_EMAIL = context.env.FROM_EMAIL || 'noreply@news.example.com';

  // In-memory storage for this request context
  let subscribers: any[] = [];
  let newsletters: any[] = [];

  // Send email via Resend
  async function sendEmailViaResend(to: string, subject: string, html: string) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: to,
          subject: subject,
          html: html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (err: any) {
      console.error(`Error sending email to ${to}:`, err.message);
      throw err;
    }
  }

  // Health check
  if (pathname === '/make-server-53bed28f/health') {
    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Subscribers stats
  if (pathname === '/make-server-53bed28f/subscribers/stats') {
    return new Response(
      JSON.stringify({
        totalSubscribers: 0,
        activeSubscribers: 0,
        monthlyStats: [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Subscribers POST (add)
  if (pathname === '/make-server-53bed28f/subscribers' && request.method === 'POST') {
    try {
      const body = await request.json() as { email: string; language?: string };
      const { email, language = 'en' } = body;

      if (!email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Send welcome email
      if (RESEND_API_KEY) {
        try {
          const welcomeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
                .header { border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
                .header h1 { margin: 0; font-size: 24px; color: #2c3e50; }
                .content { font-size: 16px; color: #555; line-height: 1.6; }
                .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>Welcome! 🎉</h1></div>
                <div class="content">
                  <p>Thank you for subscribing to our newsletter!</p>
                  <p>You'll now receive updates and exclusive content directly in your inbox.</p>
                </div>
                <div class="footer">
                  <p>© 2026 Author Fatima. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

          await sendEmailViaResend(email, 'Welcome to our newsletter!', welcomeHtml);
          console.log(`✅ Welcome email sent to ${email}`);
        } catch (emailErr) {
          console.error('Welcome email failed:', emailErr);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          subscriber: { email, language },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (err: any) {
      console.error('Subscriber error:', err);
      return new Response(JSON.stringify({ error: err.message || 'Failed to add subscriber' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Subscribers GET (list)
  if (pathname === '/make-server-53bed28f/subscribers' && request.method === 'GET') {
    const token = request.headers.get('Authorization');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ subscribers: [], total: 0 }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Newsletters POST (create)
  if (pathname === '/make-server-53bed28f/newsletters' && request.method === 'POST') {
    const token = request.headers.get('Authorization');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json() as { title: string; content: string; language?: string };
      const { title, content, language = 'en' } = body;

      if (!title || !content) {
        return new Response(JSON.stringify({ error: 'Title and content required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const id = `newsletter-${Date.now()}`;

      return new Response(
        JSON.stringify({
          success: true,
          newsletter: { id, title, content, language, status: 'draft' },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Newsletters GET (list)
  if (pathname === '/make-server-53bed28f/newsletters' && request.method === 'GET') {
    const token = request.headers.get('Authorization');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ newsletters: [] }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Send newsletter
  if (pathname.match(/^\/make-server-53bed28f\/newsletters\/[^/]+\/send$/) && request.method === 'POST') {
    const token = request.headers.get('Authorization');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const id = pathname.split('/')[3];
      
      // Get newsletter data from request body
      const body = await request.json() as { title: string; content: string; recipients: string[] };
      const { title, content, recipients = [] } = body;

      if (!recipients || recipients.length === 0) {
        return new Response(JSON.stringify({ error: 'No recipients provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.log(`📧 Sending newsletter to ${recipients.length} recipients`);

      const results = [];
      let successCount = 0;

      // Send to each recipient
      for (let i = 0; i < recipients.length; i++) {
        const email = recipients[i];
        try {
          const newsletterHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
                .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 20px; font-size: 16px; color: #555; line-height: 1.6; }
                .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>${title}</h1></div>
                <div class="content">${content}</div>
                <div class="footer">
                  <p>© 2026 Author Fatima. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

          const result = await sendEmailViaResend(email, title, newsletterHtml);
          console.log(`✅ Newsletter sent to ${email}: ${result.id}`);
          results.push({ email, success: true, id: result.id });
          successCount++;
        } catch (err: any) {
          console.error(`❌ Failed to send to ${email}:`, err.message);
          results.push({ email, success: false, error: err.message });
        }

        // Rate limiting: 500ms between sends
        if (i < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log(`📊 Newsletter sent: ${successCount}/${recipients.length} successful`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Newsletter sent to ${successCount}/${recipients.length} recipients`,
          recipientCount: recipients.length,
          successCount: successCount,
          results: results,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (err: any) {
      console.error('Newsletter send error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Send email
  if (pathname === '/make-server-53bed28f/send-email' && request.method === 'POST') {
    const token = request.headers.get('Authorization');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json() as { recipients: string[]; subject: string; content: string };
      const { recipients, subject, content } = body;

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return new Response(JSON.stringify({ error: 'Recipients required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const results = [];
      let successCount = 0;

      for (let i = 0; i < recipients.length; i++) {
        const email = recipients[i];
        try {
          const result = await sendEmailViaResend(email, subject, content);
          results.push({ email, success: true, id: result.id });
          successCount++;
        } catch (err: any) {
          results.push({ email, success: false, error: err.message });
        }

        if (i < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Email sent to ${successCount}/${recipients.length} recipients`,
          recipientCount: recipients.length,
          successCount: successCount,
          results: results,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Default 404
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
