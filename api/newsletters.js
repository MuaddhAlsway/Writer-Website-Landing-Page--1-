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

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = getDb();

  try {
    if (req.method === 'POST') {
      const { title, subject, content, language } = req.body;
      const newsletterTitle = title || subject;
      if (!newsletterTitle) return res.status(400).json({ error: 'Title or subject required' });
      if (!content) return res.status(400).json({ error: 'Content required' });

      const id = `newsletter-${Date.now()}`;
      await db.execute(
        'INSERT INTO newsletters (id, title, content, language, status) VALUES (?, ?, ?, ?, ?)',
        [id, newsletterTitle, content, language || 'en', 'draft']
      );

      return res.status(200).json({
        success: true,
        newsletter: {
          id, title: newsletterTitle, subject: newsletterTitle,
          content, language: language || 'en', status: 'draft',
          createdAt: new Date().toISOString(),
        },
      });
    }

    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM newsletters ORDER BY created_at DESC');
      const newsletters = result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        subject: row.title,
        content: row.content,
        language: row.language,
        status: row.status,
        createdAt: row.created_at,
      }));
      return res.status(200).json({ newsletters });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID required' });

      const result = await db.execute('DELETE FROM newsletters WHERE id = ?', [id]);
      if (result.rowsAffected > 0) return res.status(200).json({ success: true });
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Newsletters API error:', err.message);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
