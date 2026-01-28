import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
}));
app.use(express.json());

// In-memory storage
const subscribers = new Map();
const newsletters = new Map();
const admins = new Map();
const monthlyStats = new Map();

// Mock admin account
admins.set('admin@example.com', { password: 'admin123', id: 'admin-1' });

// Add test subscribers
subscribers.set('john@example.com', { email: 'john@example.com', language: 'en', subscribedAt: new Date().toISOString(), name: 'John Doe' });
subscribers.set('jane@example.com', { email: 'jane@example.com', language: 'en', subscribedAt: new Date().toISOString(), name: 'Jane Smith' });
subscribers.set('ahmed@example.com', { email: 'ahmed@example.com', language: 'ar', subscribedAt: new Date().toISOString(), name: 'أحمد' });

// ============= HEALTH CHECK =============
app.get('/make-server-53bed28f/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============= ADMIN AUTH =============
app.post('/make-server-53bed28f/admin/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (admins.has(email)) {
    return res.status(400).json({ error: 'Admin already exists' });
  }

  const userId = `admin-${Date.now()}`;
  admins.set(email, { password, id: userId, name });
  
  res.json({ 
    success: true, 
    user: { id: userId, email, user_metadata: { name, role: 'admin' } }
  });
});

// ============= SUBSCRIBERS =============
app.post('/make-server-53bed28f/subscribers', (req, res) => {
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
  };

  subscribers.set(email, subscriber);
  
  // Update monthly stats
  const month = new Date().toISOString().slice(0, 7);
  monthlyStats.set(month, (monthlyStats.get(month) || 0) + 1);

  res.json({ success: true, subscriber });
});

app.get('/make-server-53bed28f/subscribers', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const list = Array.from(subscribers.values());
  res.json({ subscribers: list, total: list.length });
});

app.get('/make-server-53bed28f/subscribers/stats', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const total = subscribers.size;
  const active = Math.floor(total * 0.8);
  
  const monthlyData = Array.from(monthlyStats.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  res.json({
    totalSubscribers: total,
    activeSubscribers: active,
    monthlyStats: monthlyData,
  });
});

app.delete('/make-server-53bed28f/subscribers/:email', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email } = req.params;
  if (subscribers.has(email)) {
    subscribers.delete(email);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Subscriber not found' });
  }
});

// ============= NEWSLETTERS =============
app.post('/make-server-53bed28f/newsletters', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, content, language } = req.body;
  const id = `newsletter-${Date.now()}`;
  
  const newsletter = {
    id,
    title,
    content,
    language: language || 'en',
    status: 'draft',
    createdAt: new Date().toISOString(),
  };

  newsletters.set(id, newsletter);
  res.json({ success: true, newsletter });
});

app.get('/make-server-53bed28f/newsletters', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const list = Array.from(newsletters.values());
  res.json({ newsletters: list });
});

app.post('/make-server-53bed28f/newsletters/:id/send', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const newsletter = newsletters.get(id);
  
  if (!newsletter) {
    return res.status(404).json({ error: 'Newsletter not found' });
  }

  newsletter.status = 'sent';
  newsletter.sentAt = new Date().toISOString();
  
  res.json({ success: true, newsletter });
});

app.delete('/make-server-53bed28f/newsletters/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  if (newsletters.has(id)) {
    newsletters.delete(id);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Newsletter not found' });
  }
});

// ============= EMAIL =============
app.post('/make-server-53bed28f/send-email', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { recipients, subject, content } = req.body;
  
  console.log(`Email sent to ${recipients.length} recipients`);
  console.log(`Subject: ${subject}`);
  
  res.json({ 
    success: true, 
    message: `Email sent to ${recipients.length} recipients`,
    recipientCount: recipients.length,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`\nTest admin credentials:`);
  console.log(`Email: admin@example.com`);
  console.log(`Password: admin123`);
});
