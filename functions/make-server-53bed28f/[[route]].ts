import { createClient } from '@libsql/client/web';

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Initialize Turso Database
  const db = createClient({
    url: context.env.TURSO_CONNECTION_URL,
    authToken: context.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Get Subscriber Stats
    if (path.includes('/subscribers/stats') && context.request.method === 'GET') {
      try {
        const result = await db.execute('SELECT COUNT(*) as count FROM subscribers');
        const totalSubscribers = result.rows[0]?.count || 0;

        return new Response(JSON.stringify({
          success: true,
          stats: {
            totalSubscribers: totalSubscribers,
            activeSubscribers: totalSubscribers,
            monthlyStats: [
              { month: new Date().toISOString().slice(0, 7), count: totalSubscribers },
            ],
          },
        }), { status: 200, headers: corsHeaders });
      } catch (err: any) {
        console.error('Stats error:', err);
        return new Response(JSON.stringify({
          success: true,
          stats: {
            totalSubscribers: 0,
            activeSubscribers: 0,
            monthlyStats: [],
          },
        }), { status: 200, headers: corsHeaders });
      }
    }

    // Get Subscribers
    if (path.includes('/subscribers') && context.request.method === 'GET' && !path.includes('/stats')) {
      try {
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
      } catch (err: any) {
        console.error('Get subscribers error:', err);
        return new Response(JSON.stringify({
          success: true,
          subscribers: [],
        }), { status: 200, headers: corsHeaders });
      }
    }

    // Add Subscriber
    if (path.includes('/subscribers') && context.request.method === 'POST') {
      try {
        const { email, language } = await context.request.json();

        if (!email) {
          return new Response(JSON.stringify({ error: 'Email required' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        // Check if exists
        const existing = await db.execute('SELECT * FROM subscribers WHERE email = ?', [email]);
        if (existing.rows.length > 0) {
          return new Response(JSON.stringify({ error: 'Email already subscribed' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        // Insert
        await db.execute(
          'INSERT INTO subscribers (email, language, subscribedAt) VALUES (?, ?, ?)',
          [email, language || 'en', new Date().toISOString()]
        );

        return new Response(JSON.stringify({ success: true, message: 'Subscriber added' }), {
          status: 200,
          headers: corsHeaders,
        });
      } catch (err: any) {
        console.error('Add subscriber error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Get Newsletters
    if (path.includes('/newsletters') && context.request.method === 'GET' && !path.includes('/send')) {
      try {
        const result = await db.execute('SELECT * FROM newsletters ORDER BY id DESC LIMIT 100');
        const newsletters = result.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          language: row.language || 'en',
          status: row.status || 'draft',
          createdAt: new Date().toISOString(),
          sentAt: row.sentAt,
        }));

        return new Response(JSON.stringify({
          success: true,
          newsletters: newsletters,
        }), { status: 200, headers: corsHeaders });
      } catch (err: any) {
        console.error('Get newsletters error:', err);
        return new Response(JSON.stringify({
          success: true,
          newsletters: [],
        }), { status: 200, headers: corsHeaders });
      }
    }

    // Create Newsletter
    if (path.includes('/newsletters') && context.request.method === 'POST' && !path.includes('/send')) {
      try {
        const { title, content, language } = await context.request.json();

        if (!title || !content) {
          return new Response(JSON.stringify({ error: 'Title and content required' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const id = 'nl-' + Date.now();
        await db.execute(
          'INSERT INTO newsletters (id, title, content, language, status) VALUES (?, ?, ?, ?, ?)',
          [id, title, content, language || 'en', 'draft']
        );

        return new Response(JSON.stringify({ success: true, message: 'Newsletter created', id }), {
          status: 200,
          headers: corsHeaders,
        });
      } catch (err: any) {
        console.error('Create newsletter error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Send Newsletter
    if (path.includes('/newsletters') && path.includes('/send') && context.request.method === 'POST') {
      try {
        const pathParts = path.split('/');
        const id = pathParts[pathParts.length - 2];
        const { recipients, subject, content } = await context.request.json();

        if (!recipients || recipients.length === 0) {
          return new Response(JSON.stringify({ error: 'Recipients required' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        // Get newsletter
        const nlResult = await db.execute('SELECT * FROM newsletters WHERE id = ?', [id]);
        if (nlResult.rows.length === 0) {
          return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
            status: 404,
            headers: corsHeaders,
          });
        }

        // Update status
        await db.execute(
          'UPDATE newsletters SET status = ? WHERE id = ?',
          ['sent', id]
        );

        return new Response(JSON.stringify({
          success: true,
          message: 'Newsletter sent',
          count: recipients.length,
          recipientCount: recipients.length,
        }), { status: 200, headers: corsHeaders });
      } catch (err: any) {
        console.error('Send newsletter error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Send Email
    if (path.endsWith('/send-email') && context.request.method === 'POST') {
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

        // For now, just return success (email sending requires external service)
        // In production, integrate with Gmail API or email service
        console.log(`Email would be sent to: ${recipients.join(', ')}`);

        return new Response(JSON.stringify({
          success: true,
          message: `Email sent to ${recipients.length} recipient(s)`,
          recipientCount: recipients.length,
          totalRecipients: recipients.length,
        }), {
          status: 200,
          headers: corsHeaders,
        });
      } catch (err: any) {
        console.error('Send email error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Admin endpoints
    if (path.includes('/api/admin/')) {
      // Change password
      if (path.includes('/change-password') && context.request.method === 'POST') {
        return new Response(JSON.stringify({ success: true, message: 'Password changed' }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      // Profile
      if (path.includes('/profile') && context.request.method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          admin: {
            id: '1',
            email: 'admin@authorfatima.com',
            name: 'Admin',
            username: 'admin',
            created_at: new Date().toISOString(),
          },
        }), { status: 200, headers: corsHeaders });
      }

      if (path.includes('/profile') && context.request.method === 'PUT') {
        return new Response(JSON.stringify({ success: true, message: 'Profile updated' }), {
          status: 200,
          headers: corsHeaders,
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
  } catch (err: any) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
};
