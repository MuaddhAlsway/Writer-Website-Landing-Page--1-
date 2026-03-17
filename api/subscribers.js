// In-memory storage for subscribers
let subscribers = new Map();

// Initialize with test data
subscribers.set('john@example.com', { 
  email: 'john@example.com', 
  language: 'en', 
  subscribedAt: new Date().toISOString(), 
  name: 'John Doe' 
});
subscribers.set('jane@example.com', { 
  email: 'jane@example.com', 
  language: 'en', 
  subscribedAt: new Date().toISOString(), 
  name: 'Jane Smith' 
});
subscribers.set('ahmed@example.com', { 
  email: 'ahmed@example.com', 
  language: 'ar', 
  subscribedAt: new Date().toISOString(), 
  name: 'أحمد' 
});

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

  // POST - Subscribe
  if (req.method === 'POST') {
    try {
      const { email, language } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      if (subscribers.has(email)) {
        return res.status(400).json({ error: 'Already subscribed' });
      }

      const subscriber = {
        email,
        language: language || 'en',
        subscribedAt: new Date().toISOString(),
        name: '',
      };

      subscribers.set(email, subscriber);
      console.log(`✅ Subscriber added: ${email}`);

      return res.status(200).json({ success: true, subscriber });
    } catch (err) {
      console.error('Error adding subscriber:', err);
      return res.status(500).json({ error: 'Failed to add subscriber', details: err.message });
    }
  }

  // GET - List subscribers
  if (req.method === 'GET') {
    try {
      const list = Array.from(subscribers.values());
      console.log(`✅ Retrieved ${list.length} subscribers`);
      return res.status(200).json({ subscribers: list, total: list.length });
    } catch (err) {
      console.error('Error getting subscribers:', err);
      return res.status(500).json({ error: 'Failed to get subscribers', details: err.message });
    }
  }

  // DELETE - Remove subscriber
  if (req.method === 'DELETE') {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      if (subscribers.has(email)) {
        subscribers.delete(email);
        console.log(`✅ Subscriber deleted: ${email}`);
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ error: 'Subscriber not found' });
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      return res.status(500).json({ error: 'Failed to delete subscriber', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
