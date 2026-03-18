import { createClient } from '@libsql/client';

function getDb(env: any) {
  const url = env.TURSO_CONNECTION_URL?.split('?')[0];
  const authToken = env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(`Database not configured. Missing: ${!url ? 'TURSO_CONNECTION_URL ' : ''}${!authToken ? 'TURSO_AUTH_TOKEN' : ''}`);
  }
  return createClient({ url, authToken });
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  let db: any;
  try {
    db = getDb(env);
  } catch (err: any) {
    return json({ error: 'Database not configured', details: err.message }, 503);
  }

  try {
    // Ensure tables exist before querying
    await db.execute(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        language TEXT DEFAULT 'en',
        name TEXT DEFAULT '',
        subscribedAt TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        content TEXT,
        sentAt TEXT DEFAULT (datetime('now')),
        recipientCount INTEGER DEFAULT 0
      )
    `);

    const [subResult, nlResult] = await Promise.all([
      db.execute('SELECT COUNT(*) as count FROM subscribers'),
      db.execute('SELECT COUNT(*) as count FROM newsletters'),
    ]);

    const totalSubscribers = Number(subResult.rows[0]?.count ?? 0);
    const totalNewsletters = Number(nlResult.rows[0]?.count ?? 0);

    // Get recent newsletters
    const recentNl = await db.execute(
      'SELECT id, subject, sentAt, recipientCount FROM newsletters ORDER BY sentAt DESC LIMIT 5'
    );

    return json({
      success: true,
      stats: {
        totalSubscribers,
        totalNewsletters,
        recentNewsletters: recentNl.rows,
      },
    });
  } catch (err: any) {
    return json({ error: 'Failed to fetch stats', details: err.message }, 500);
  }
}
