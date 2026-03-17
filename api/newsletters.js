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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  try {
    const db_instance = initDb();

    // POST - Create newsletter
    if (req.method === 'POST') {
      const { title, subject, content, language } = req.body;
      
      if (!subject || !content) {
        return res.status(400).json({ error: 'Subject and content required' });
      }

      const id = `newsletter-${Date.now()}`;
      const now = new Date().toISOString();
      
      await db_instance.execute(
        'INSERT INTO newsletters (id, title, content, language, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title || subject, content, language || 'en', 'draft', now]
      );

      console.log(`✅ Newsletter saved to Turso: ${id}`);

      const newsletter = {
        id,
        title: title || subject,
        subject,
        content,
        language: language || 'en',
        status: 'draft',
        createdAt: now,
      };

      return res.status(200).json({ success: true, newsletter });
    }

    // GET - List newsletters
    if (req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await db_instance.execute('SELECT * FROM newsletters ORDER BY created_at DESC');
      const newsletters = result.rows.map(row => ({
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
    }

    // DELETE - Remove newsletter
    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.body;
      const result = await db_instance.execute('DELETE FROM newsletters WHERE id = ?', [id]);

      if (result.rowsAffected > 0) {
        console.log(`✅ Newsletter deleted from Turso: ${id}`);
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('❌ API error:', err.message);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
