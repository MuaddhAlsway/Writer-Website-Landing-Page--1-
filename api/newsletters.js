// In-memory storage for newsletters
let newsletters = new Map();

export default function handler(req, res) {
  // CORS headers - CRITICAL FIX
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST - Create newsletter
  if (req.method === 'POST') {
    try {
      const { title, subject, content, language } = req.body;
      
      if (!title && !subject) {
        return res.status(400).json({ error: 'Title or subject required' });
      }

      if (!content) {
        return res.status(400).json({ error: 'Content required' });
      }

      const id = `newsletter-${Date.now()}`;
      const newsletter = {
        id,
        title: title || subject,
        subject: subject || title,
        content,
        language: language || 'en',
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      newsletters.set(id, newsletter);
      console.log(`✅ Newsletter created: ${id}`);

      return res.status(200).json({ success: true, newsletter });
    } catch (err) {
      console.error('Error creating newsletter:', err);
      return res.status(500).json({ error: 'Failed to create newsletter', details: err.message });
    }
  }

  // GET - List newsletters
  if (req.method === 'GET') {
    try {
      const list = Array.from(newsletters.values());
      console.log(`✅ Retrieved ${list.length} newsletters`);
      return res.status(200).json({ newsletters: list });
    } catch (err) {
      console.error('Error getting newsletters:', err);
      return res.status(500).json({ error: 'Failed to get newsletters', details: err.message });
    }
  }

  // DELETE - Remove newsletter
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'ID required' });
      }

      if (newsletters.has(id)) {
        newsletters.delete(id);
        console.log(`✅ Newsletter deleted: ${id}`);
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ error: 'Newsletter not found' });
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      return res.status(500).json({ error: 'Failed to delete newsletter', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
