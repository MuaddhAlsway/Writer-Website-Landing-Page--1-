import { createClient } from '@libsql/client';

function getDb(env: any) {
  const url = env.TURSO_CONNECTION_URL?.split('?')[0]; // strip embedded token if present
  const authToken = env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      `Database not configured. Missing: ${!url ? 'TURSO_CONNECTION_URL ' : ''}${!authToken ? 'TURSO_AUTH_TOKEN' : ''}`
    );
  }

  return createClient({ url, authToken });
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  let db: any;
  try {
    db = getDb(env);
  } catch (err: any) {
    return json({ error: 'Database not configured', details: err.message }, 503);
  }

  // POST — subscribe
  if (request.method === 'POST') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { email, language = 'en', name = '' } = body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'Valid email required' }, 400);
    }

    try {
      // Ensure table exists
      await db.execute(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          language TEXT DEFAULT 'en',
          name TEXT DEFAULT '',
          subscribedAt TEXT DEFAULT (datetime('now'))
        )
      `);

      const existing = await db.execute('SELECT email FROM subscribers WHERE email = ?', [email]);
      if (existing.rows.length > 0) {
        return json({ error: 'Already subscribed' }, 400);
      }

      await db.execute(
        'INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)',
        [email, language, name]
      );

      // Fire-and-forget welcome email if Gmail is configured
      if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
        sendWelcomeEmail(email, language, env).catch(() => {});
      }

      return json({ success: true, subscriber: { email, language, name } });
    } catch (err: any) {
      return json({ error: 'Database error', details: err.message }, 500);
    }
  }

  // GET — list subscribers (requires auth)
  if (request.method === 'GET') {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return json({ error: 'Unauthorized' }, 401);

    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          language TEXT DEFAULT 'en',
          name TEXT DEFAULT '',
          subscribedAt TEXT DEFAULT (datetime('now'))
        )
      `);

      const result = await db.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC');
      const subscribers = result.rows.map((r: any) => ({
        id: r.id,
        email: r.email,
        language: r.language,
        name: r.name,
        subscribedAt: r.subscribedAt,
      }));
      return json({ subscribers, total: subscribers.length });
    } catch (err: any) {
      return json({ error: 'Database error', details: err.message }, 500);
    }
  }

  // DELETE — remove subscriber (requires auth)
  if (request.method === 'DELETE') {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return json({ error: 'Unauthorized' }, 401);

    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { email } = body;
    if (!email) return json({ error: 'Email required' }, 400);

    try {
      const result = await db.execute('DELETE FROM subscribers WHERE email = ?', [email]);
      if (result.rowsAffected === 0) return json({ error: 'Subscriber not found' }, 404);
      return json({ success: true });
    } catch (err: any) {
      return json({ error: 'Database error', details: err.message }, 500);
    }
  }

  return json({ error: 'Method not allowed' }, 405);
}

async function sendWelcomeEmail(email: string, language: string, env: any) {
  const isAr = language === 'ar';
  const subject = isAr ? 'مرحبا بك في قائمتنا البريدية' : 'Welcome to Our Newsletter';
  const body = isAr
    ? '<p>شكراً لاشتراكك! سنبقيك على اطلاع بآخر الأخبار.</p>'
    : '<p>Thank you for subscribing! We will keep you updated with the latest news.</p>';

  // Use MailChannels (available on Cloudflare Workers/Pages for free)
  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: env.GMAIL_USER, name: 'Author Fatima' },
        subject,
        content: [{ type: 'text/html', value: body }],
      }),
    });
  } catch {
    // Silently fail — welcome email is non-critical
  }
}
