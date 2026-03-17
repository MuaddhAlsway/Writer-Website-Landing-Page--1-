import { createClient } from '@libsql/client';

// Initialize Turso client
const turso = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST - Create newsletter
    if (req.method === 'POST') {
      const { title, subject, content, language } = req.body;
      
      if (!title && !subject) {
        return res.status(400).json({ error: 'Title or subject required' });
      }

      if (!content) {
        return res.status(400).json({ error: 'Content required' });
      }

      try {
        const id = `newsletter-${Date.now()}`;
        const newsletterTitle = title || subject;

        await turso.execute(
          'INSERT INTO newsletters (id, title, content, language, status) VALUES (?, ?, ?, ?, ?)',
          [id, newsletterTitle, content, language || 'en', 'draft']
        );

        console.log(`✅ Newsletter created in Turso: ${id}`);

        const newsletter = {
          id,
          title: newsletterTitle,
          subject: newsletterTitle,
          content,
          language: language || 'en',
          status: 'draft',
          createdAt: new Date().toISOString(),
        };

        return res.status(200).json({ success: true, newsletter });
      } catch (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
    }

    // GET - List newsletters
    if (req.method === 'GET') {
      try {
        const result = await turso.execute('SELECT * FROM newsletters ORDER BY created_at DESC');
        const newsletters = result.rows.map((row) => ({
          id: row.id,
          title: row.title,
          subject: row.title,
          content: row.content,
          language: row.language,
          status: row.status,
          createdAt: row.created_at,
        }));

        console.log(`✅ Retrieved ${newsletters.length} newsletters from Turso`);
        return res.status(200).json({ newsletters });
      } catch (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
    }

    // DELETE - Remove newsletter
    if (req.method === 'DELETE') {
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID required' });
        }

        const result = await turso.execute(
          'DELETE FROM newsletters WHERE id = ?',
          [id]
        );

        if (result.rowsAffected > 0) {
          console.log(`✅ Newsletter deleted from Turso: ${id}`);
          return res.status(200).json({ success: true });
        }
        return res.status(404).json({ error: 'Newsletter not found' });
      } catch (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err.message);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
