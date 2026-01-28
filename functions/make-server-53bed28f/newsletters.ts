import { Resend } from 'resend';

interface Newsletter {
  id: string;
  title: string;
  content: string;
  language: string;
  status: string;
  createdAt: string;
  sentAt?: string;
}

function getEmailTemplate(title: string, content: string) {
  const htmlContent = content.includes('<') ? content : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #2c3e50; color: #ffffff; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px; color: #555;">
                  ${htmlContent}
                </td>
              </tr>
              <tr>
                <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; border-top: 1px solid #bdc3c7;">
                  <p style="margin: 5px 0;">You received this email because you subscribed to our mailing list.</p>
                  <p style="margin: 5px 0;">&copy; 2026. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;
  const pathname = url.pathname;

  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  const FROM_EMAIL = context.env.FROM_EMAIL || 'noreply@news.example.com';
  const resend = new Resend(RESEND_API_KEY);

  const kv = context.env.NEWSLETTERS_KV;
  const subscribersKv = context.env.SUBSCRIBERS_KV;

  try {
    // POST - Create newsletter
    if (method === 'POST' && pathname === '/make-server-53bed28f/newsletters') {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const body = await request.json() as { title: string; content: string; language?: string };
      const { title, content, language = 'en' } = body;

      if (!title || !content) {
        return new Response(JSON.stringify({ error: 'Title and content required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const id = `newsletter-${Date.now()}`;
      const newsletter: Newsletter = {
        id,
        title,
        content,
        language,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      await kv.put(id, JSON.stringify(newsletter));

      return new Response(JSON.stringify({ success: true, newsletter }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET - List newsletters
    if (method === 'GET' && pathname === '/make-server-53bed28f/newsletters') {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const list = await kv.list();
      const newsletters: Newsletter[] = [];

      for (const key of list.keys) {
        const data = await kv.get(key.name);
        if (data) {
          newsletters.push(JSON.parse(data));
        }
      }

      return new Response(JSON.stringify({ newsletters }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // POST - Send newsletter
    if (method === 'POST' && pathname.includes('/send')) {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const id = pathname.split('/')[3];
      const newsletterData = await kv.get(id);

      if (!newsletterData) {
        return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const newsletter: Newsletter = JSON.parse(newsletterData);

      // Get subscribers
      const subList = await subscribersKv.list();
      const subscribers: string[] = [];

      for (const key of subList.keys) {
        const data = await subscribersKv.get(key.name);
        if (data) {
          const sub = JSON.parse(data);
          subscribers.push(sub.email);
        }
      }

      // Send emails with rate limiting
      const results = [];
      for (let i = 0; i < subscribers.length; i++) {
        const email = subscribers[i];
        try {
          const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: newsletter.title,
            html: getEmailTemplate(newsletter.title, newsletter.content),
          });

          results.push({ email, success: true, id: result.data?.id });
        } catch (err: any) {
          results.push({ email, success: false, error: err.message });
        }

        // Rate limiting: 500ms between sends
        if (i < subscribers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Update newsletter status
      newsletter.status = 'sent';
      newsletter.sentAt = new Date().toISOString();
      await kv.put(id, JSON.stringify(newsletter));

      const successCount = results.filter(r => r.success).length;

      return new Response(
        JSON.stringify({
          success: true,
          newsletter,
          recipientCount: subscribers.length,
          successCount,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // DELETE - Delete newsletter
    if (method === 'DELETE') {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const id = pathname.split('/')[3];
      await kv.delete(id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
