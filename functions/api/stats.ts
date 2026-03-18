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
    // Tables already exist in production DB — no CREATE needed

    const [subResult, nlResult] = await Promise.all([
      db.execute('SELECT COUNT(*) as count FROM subscribers'),
      db.execute('SELECT COUNT(*) as count FROM newsletters'),
    ]);

    const totalSubscribers = Number(subResult.rows[0]?.count ?? 0);
    const totalNewsletters = Number(nlResult.rows[0]?.count ?? 0);

    // Get recent newsletters (use actual schema: title, created_at, sent_at)
    const recentNl = await db.execute(
      'SELECT id, title, created_at, sent_at, status FROM newsletters ORDER BY created_at DESC LIMIT 5'
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
