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
    // POST - Subscribe
    if (req.method === 'POST') {
      const { email, language } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      try {
        // Check if already subscribed
        const existing = await turso.execute(
          'SELECT * FROM subscribers WHERE email = ?',
          [email]
        );

        if (existing.rows.length > 0) {
          return res.status(400).json({ error: 'Already subscribed' });
        }

        // Add to Turso
        await turso.execute(
          'INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)',
          [email, language || 'en', '']
        );

        console.log(`✅ Subscriber added to Turso: ${email}`);

        const subscriber = {
          email,
          language: language || 'en',
          subscribedAt: new Date().toISOString(),
          name: '',
        };

        return res.status(200).json({ success: true, subscriber });
      } catch (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
    }

    // GET - List subscribers
    if (req.method === 'GET') {
      try {
        const result = await turso.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC');
        const subscribers = result.rows.map((row) => ({
          email: row.email,
          language: row.language,
          subscribedAt: row.subscribedAt,
          name: row.name,
        }));

        console.log(`✅ Retrieved ${subscribers.length} subscribers from Turso`);
        return res.status(200).json({ subscribers, total: subscribers.length });
      } catch (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
    }

    // DELETE - Remove subscriber
    if (req.method === 'DELETE') {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ error: 'Email required' });
        }

        const result = await turso.execute(
          'DELETE FROM subscribers WHERE email = ?',
          [email]
        );

        if (result.rowsAffected > 0) {
          console.log(`✅ Subscriber deleted from Turso: ${email}`);
          return res.status(200).json({ success: true });
        }
        return res.status(404).json({ error: 'Subscriber not found' });
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
