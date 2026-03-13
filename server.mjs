import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
}));
app.use(express.json());

// Setup Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
  
  // Get recipient count based on language
  let recipientCount = 0;
  if (!newsletter.language || newsletter.language === '') {
    // Send to all subscribers
    recipientCount = subscribers.size;
  } else {
    // Send to subscribers with matching language
    recipientCount = Array.from(subscribers.values()).filter(s => s.language === newsletter.language).length;
  }
  
  res.json({ success: true, newsletter, recipientCount });
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
app.post('/make-server-53bed28f/send-newsletter', async (req, res) => {
  const { recipients, subject, content } = req.body;
  
  try {
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients required' });
    }

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content required' });
    }

    // Send emails via Nodemailer
    const results = [];
    let sentCount = 0;
    
    for (const recipient of recipients) {
      try {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="${recipient.language === 'ar' ? 'ar' : 'en'}" dir="${recipient.language === 'ar' ? 'rtl' : 'ltr'}">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; direction: ${recipient.language === 'ar' ? 'rtl' : 'ltr'}; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
              .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
              .content { padding: 40px 30px; text-align: ${recipient.language === 'ar' ? 'right' : 'left'}; }
              .content p { color: #333; font-size: 15px; line-height: 1.8; margin-bottom: 15px; }
              .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
              .footer-text { color: #666; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${subject}</h1>
              </div>
              <div class="content">
                ${content}
              </div>
              <div class="footer">
                <p class="footer-text">${recipient.language === 'ar' ? '© 2026 جميع الحقوق محفوظة' : '© 2026 All rights reserved'}</p>
              </div>
            </div>
          </body>
          </html>
        `;

        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: recipient.email,
          subject: subject,
          html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient.email}:`, info.response);
        results.push({
          email: recipient.email,
          success: true,
          messageId: info.messageId,
        });
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send email to ${recipient.email}:`, err.message);
        results.push({
          email: recipient.email,
          success: false,
          error: err.message,
        });
      }
    }

    const failureCount = results.filter(r => !r.success).length;

    res.json({ 
      success: true, 
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      sentCount: sentCount,
      recipientCount: sentCount,
      results: results,
    });
  } catch (err: any) {
    console.error('Send newsletter error:', err);
    res.status(500).json({ error: 'Failed to send newsletter', details: err.message });
  }
});

app.post('/make-server-53bed28f/send-email', async (req, res) => {
  const { recipients, subject, content, language = 'en' } = req.body;
  
  try {
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients required' });
    }

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content required' });
    }

    // Send emails via Nodemailer
    const results = [];
    let sentCount = 0;
    
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: recipient,
          subject: subject,
          html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient}:`, info.response);
        results.push({
          email: recipient,
          success: true,
          messageId: info.messageId,
        });
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send email to ${recipient}:`, err.message);
        results.push({
          email: recipient,
          success: false,
          error: err.message,
        });
      }
    }

    const failureCount = results.filter(r => !r.success).length;

    res.json({ 
      success: true, 
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      recipientCount: sentCount,
      results: results,
    });
  } catch (err: any) {
    console.error('Send email error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`\nTest admin credentials:`);
  console.log(`Email: admin@example.com`);
  console.log(`Password: admin123`);
});
