import { createClient } from '@libsql/client';

function getDb(env: any) {
  const url = env.TURSO_CONNECTION_URL?.split('?')[0]; // strip embedded ?authToken= if present
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

async function sendViaMailChannels(
  to: string,
  subject: string,
  html: string,
  fromEmail: string
): Promise<boolean> {
  try {
    const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: 'Author Fatima' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });
    return res.ok || res.status === 202;
  } catch {
    return false;
  }
}

function buildHtml(subject: string, content: string, language = 'en') {
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const align = isAr ? 'right' : 'left';
  return `<!DOCTYPE html><html lang="${language}" dir="${dir}"><head><meta charset="UTF-8">
<style>body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;direction:${dir}}
.box{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden}
.hdr{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:40px 20px;text-align:center}
.hdr h1{margin:0;font-size:26px}.body{padding:30px 20px;text-align:${align};line-height:1.7;color:#333}
.ftr{background:#f8f9fa;padding:20px;text-align:center;font-size:12px;color:#666}
.ftr a{color:#667eea;text-decoration:none}</style></head>
<body><div class="box">
<div class="hdr"><h1>${subject}</h1></div>
<div class="body">${content}</div>
<div class="ftr"><p>© 2026 All rights reserved</p>
<p><a href="https://main.author-fatima-76r-eis.pages.dev">Website</a> | <a href="mailto:AuthorFSK@gmail.com">Email</a></p>
</div></div></body></html>`;
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return json({ error: 'Unauthorized' }, 401);

  let db: any;
  try {
    db = getDb(env);
  } catch (err: any) {
    return json({ error: 'Database not configured', details: err.message }, 503);
  }

  // Ensure tables exist
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        content TEXT,
        sentAt TEXT DEFAULT (datetime('now')),
        recipientCount INTEGER DEFAULT 0
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        language TEXT DEFAULT 'en',
        name TEXT DEFAULT '',
        subscribedAt TEXT DEFAULT (datetime('now'))
      )
    `);
  } catch (err: any) {
    return json({ error: 'Database init failed', details: err.message }, 500);
  }

  // GET — list newsletters
  if (request.method === 'GET') {
    try {
      const result = await db.execute('SELECT * FROM newsletters ORDER BY sentAt DESC');
      const newsletters = result.rows.map((r: any) => ({
        id: r.id,
        subject: r.subject,
        content: r.content,
        sentAt: r.sentAt,
        recipientCount: r.recipientCount,
      }));
      return json({ success: true, newsletters, total: newsletters.length });
    } catch (err: any) {
      return json({ error: 'Failed to get newsletters', details: err.message }, 500);
    }
  }

  // POST — send newsletter
  if (request.method === 'POST') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { subject, content } = body;
    if (!subject || !content) return json({ error: 'Subject and content required' }, 400);

    try {
      const subResult = await db.execute('SELECT email, language FROM subscribers');
      const subscribers = subResult.rows;

      const fromEmail = env.GMAIL_USER || 'noreply@author-fatima.pages.dev';
      let sent = 0;
      let failed = 0;

      for (const sub of subscribers) {
        const html = buildHtml(subject, content, sub.language || 'en');
        const ok = await sendViaMailChannels(sub.email, subject, html, fromEmail);
        ok ? sent++ : failed++;
      }

      // Save to DB
      await db.execute(
        'INSERT INTO newsletters (subject, content, sentAt, recipientCount) VALUES (?, ?, ?, ?)',
        [subject, content, new Date().toISOString(), sent]
      );

      return json({ success: true, message: `Newsletter sent to ${sent} subscribers`, sent, failed, total: subscribers.length });
    } catch (err: any) {
      return json({ error: 'Failed to send newsletter', details: err.message }, 500);
    }
  }

  // DELETE — remove newsletter
  if (request.method === 'DELETE') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }
    const { id } = body;
    if (!id) return json({ error: 'ID required' }, 400);
    try {
      const result = await db.execute('DELETE FROM newsletters WHERE id = ?', [id]);
      if (result.rowsAffected === 0) return json({ error: 'Newsletter not found' }, 404);
      return json({ success: true });
    } catch (err: any) {
      return json({ error: 'Database error', details: err.message }, 500);
    }
  }

  return json({ error: 'Method not allowed' }, 405);
}
