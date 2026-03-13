import { createClient } from '@libsql/client/web';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Initialize Turso
    const db = createClient({
      url: env.TURSO_CONNECTION_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    try {
      // Get subscribers
      if (path === '/make-server-53bed28f/subscribers' && request.method === 'GET') {
        const result = await db.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC LIMIT 100');
        const subscribers = result.rows.map((row: any) => ({
          email: row.email,
          name: row.name || '',
          language: row.language || 'en',
          subscribedAt: row.subscribedAt || new Date().toISOString(),
        }));

        return new Response(JSON.stringify({
          success: true,
          subscribers: subscribers,
        }), { status: 200, headers: corsHeaders });
      }

      // Add subscriber
      if (path === '/make-server-53bed28f/subscribers' && request.method === 'POST') {
        const { email, language } = await request.json();

        if (!email) {
          return new Response(JSON.stringify({ error: 'Email required' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const existing = await db.execute('SELECT * FROM subscribers WHERE email = ?', [email]);
        if (existing.rows.length > 0) {
          return new Response(JSON.stringify({ error: 'Email already subscribed' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        await db.execute(
          'INSERT INTO subscribers (email, language, subscribedAt) VALUES (?, ?, ?)',
          [email, language || 'en', new Date().toISOString()]
        );

        return new Response(JSON.stringify({ success: true, message: 'Subscriber added' }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      // Send email
      if (path === '/make-server-53bed28f/send-email' && request.method === 'POST') {
        const { recipients, subject, content, language } = await request.json();

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

        let sentCount = 0;
        const errors: string[] = [];

        // Send via SendGrid or similar service that works with Workers
        for (const recipient of recipients) {
          try {
            // Using Cloudflare Email Routing or external service
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                personalizations: [{ to: [{ email: recipient }] }],
                from: { email: env.EMAIL_USER },
                subject: subject,
                content: [{ type: 'text/html', value: content }],
              }),
            });

            if (response.ok) {
              sentCount++;
              console.log(`✅ Email sent to ${recipient}`);
            } else {
              errors.push(`${recipient}: Failed to send`);
            }
          } catch (err: any) {
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
      }

      // Get newsletters
      if (path === '/make-server-53bed28f/newsletters' && request.method === 'GET') {
        const result = await db.execute('SELECT * FROM newsletters ORDER BY createdAt DESC LIMIT 100');
        const newsletters = result.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          language: row.language || 'en',
          status: row.status || 'draft',
          createdAt: row.createdAt,
          sentAt: row.sentAt,
        }));

        return new Response(JSON.stringify({
          success: true,
          newsletters: newsletters,
        }), { status: 200, headers: corsHeaders });
      }

      // Create newsletter
      if (path === '/make-server-53bed28f/newsletters' && request.method === 'POST') {
        const { title, content, language } = await request.json();

        if (!title || !content) {
          return new Response(JSON.stringify({ error: 'Title and content required' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const id = 'nl-' + Date.now();
        await db.execute(
          'INSERT INTO newsletters (id, title, content, language, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
          [id, title, content, language || 'en', 'draft', new Date().toISOString()]
        );

        return new Response(JSON.stringify({ success: true, message: 'Newsletter created', id }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      // Send newsletter
      if (path.includes('/make-server-53bed28f/newsletters/') && path.includes('/send') && request.method === 'POST') {
        const id = path.split('/')[3];
        const { recipients, subject, content } = await request.json();

        if (!recipients || recipients.length === 0) {
          return new Response(JSON.stringify({ error: 'Recipients required' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        let sentCount = 0;
        const errors: string[] = [];

        for (const recipient of recipients) {
          try {
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                personalizations: [{ to: [{ email: recipient }] }],
                from: { email: env.EMAIL_USER },
                subject: subject,
                content: [{ type: 'text/html', value: content }],
              }),
            });

            if (response.ok) {
              sentCount++;
            } else {
              errors.push(`${recipient}: Failed`);
            }
          } catch (err: any) {
            errors.push(`${recipient}: ${err.message}`);
          }
        }

        await db.execute(
          'UPDATE newsletters SET status = ?, sentAt = ? WHERE id = ?',
          ['sent', new Date().toISOString(), id]
        );

        return new Response(JSON.stringify({
          success: true,
          message: 'Newsletter sent',
          count: sentCount,
          recipientCount: sentCount,
          totalRecipients: recipients.length,
          errors: errors.length > 0 ? errors : undefined,
        }), { status: 200, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    } catch (err: any) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
