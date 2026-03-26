import { createClient } from '@libsql/client';

// WHY: createClient() must be inside a function, NOT at module level.
// Vercel evaluates top-level code during the build/bundle phase when
// process.env variables are undefined. Lazy init ensures this only
// runs at request time when env vars are available.
function getDb() {
  return createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  try {
    if (req.method === 'POST') {
      const { email, language } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });

      const existing = await db.execute(
        'SELECT id FROM subscribers WHERE email = ?', [email]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Already subscribed' });
      }

      await db.execute(
        'INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)',
        [email, language || 'en', '']
      );

      return res.status(200).json({
        success: true,
        subscriber: { email, language: language || 'en', subscribedAt: new Date().toISOString(), name: '' },
      });
    }

    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC');
      const subscribers = result.rows.map((row) => ({
        email: row.email,
        language: row.language,
        subscribedAt: row.subscribedAt,
        name: row.name,
      }));
      return res.status(200).json({ subscribers, total: subscribers.length });
    }

    if (req.method === 'DELETE') {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });

      const result = await db.execute('DELETE FROM subscribers WHERE email = ?', [email]);
      if (result.rowsAffected > 0) return res.status(200).json({ success: true });
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Subscribers API error:', err.message);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
