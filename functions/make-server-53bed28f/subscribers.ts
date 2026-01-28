import { Resend } from 'resend';

interface Subscriber {
  email: string;
  language: string;
  subscribedAt: string;
}

// Welcome email template
function getWelcomeEmailTemplate() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
        }
        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .content {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You will now receive updates from us.</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to our newsletter.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  // Get environment variables
  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  const FROM_EMAIL = context.env.FROM_EMAIL || 'noreply@news.example.com';

  // Initialize Resend
  const resend = new Resend(RESEND_API_KEY);

  // Get KV namespace for storage
  const kv = context.env.SUBSCRIBERS_KV;

  try {
    // POST - Add subscriber
    if (method === 'POST') {
      const body = await request.json() as { email: string; language?: string };
      const { email, language = 'en' } = body;

      if (!email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Check if already subscribed
      const existing = await kv.get(email);
      if (existing) {
        return new Response(JSON.stringify({ error: 'Already subscribed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Store subscriber
      const subscriber = {
        email,
        language,
        subscribedAt: new Date().toISOString(),
      };

      await kv.put(email, JSON.stringify(subscriber));

      // Send welcome email
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'Welcome to the Journey!',
          html: getWelcomeEmailTemplate(),
        });
      } catch (err) {
        console.error('Welcome email failed:', err);
      }

      return new Response(JSON.stringify({ success: true, subscriber }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET - List subscribers
    if (method === 'GET') {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // List all subscribers from KV
      const list = await kv.list();
      const subscribers: Subscriber[] = [];

      for (const key of list.keys) {
        const data = await kv.get(key.name);
        if (data) {
          subscribers.push(JSON.parse(data));
        }
      }

      return new Response(
        JSON.stringify({ subscribers, total: subscribers.length }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
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
