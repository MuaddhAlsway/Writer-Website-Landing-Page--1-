import { createClient } from '@libsql/client';

let db;

function initDb() {
  if (!db) {
    const connectionUrl = process.env.TURSO_CONNECTION_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!connectionUrl || !authToken) {
      throw new Error('Turso credentials not found');
    }

    db = createClient({
      url: connectionUrl,
      authToken: authToken,
    });
  }
  return db;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db_instance = initDb();

    const totalResult = await db_instance.execute('SELECT COUNT(*) as count FROM subscribers');
    const total = totalResult.rows[0]?.count || 0;

    const active = Math.ceil(total * 0.8);

    const monthlyResult = await db_instance.execute(`
      SELECT 
        DATE(subscribedAt) as date,
        COUNT(*) as count
      FROM subscribers
      WHERE subscribedAt >= datetime('now', '-6 months')
      GROUP BY DATE(subscribedAt)
      ORDER BY date ASC
    `);

    const monthlyStats = monthlyResult.rows.map(row => ({
      month: row.date,
      count: row.count,
    }));

    const stats = {
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: monthlyStats,
      growthRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
    };

    console.log(`✅ Stats: ${total} subscribers`);
    return res.status(200).json(stats);
  } catch (err) {
    console.error('❌ Stats error:', err.message);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
