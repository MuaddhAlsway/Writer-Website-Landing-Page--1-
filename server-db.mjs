import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'admin.db');
const emailLogPath = path.join(__dirname, 'email-log.json');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template helper
function getEmailTemplate(title, content, type = 'newsletter') {
  const htmlContent = content.includes('<') ? content : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #2c3e50; color: #ffffff; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px; color: #555;">
                  ${htmlContent}
                </td>
              </tr>
              <tr>
                <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; border-top: 1px solid #bdc3c7;">
                  <p style="margin: 5px 0;">You received this email because you subscribed to our mailing list.</p>
                  <p style="margin: 5px 0;">&copy; 2026. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Welcome email template
function getWelcomeEmailTemplate() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
        }
        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .content {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You will now receive updates from us.</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to our newsletter.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper function to log emails
function logEmail(to, subject, content, type = 'newsletter') {
  try {
    let logs = [];
    if (fs.existsSync(emailLogPath)) {
      const data = fs.readFileSync(emailLogPath, 'utf-8');
      logs = JSON.parse(data);
    }
    
    logs.push({
      timestamp: new Date().toISOString(),
      to,
      subject,
      type,
      content: content.substring(0, 200) + '...',
      status: 'sent'
    });
    
    fs.writeFileSync(emailLogPath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Failed to log email:', err);
  }
}

// Send email via Nodemailer (Gmail)
async function sendEmailViaNodemailer(to, subject, html) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      text: html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    return { success: true, id: result.messageId, service: 'nodemailer' };
  } catch (err) {
    console.error(`Error sending via Nodemailer to ${to}:`, err.message);
    throw err;
  }
}

// Send email via Resend (fallback)
async function sendEmailViaResend(to, subject, html) {
  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true, id: result.data.id, service: 'resend' };
  } catch (err) {
    console.error(`Error sending via Resend to ${to}:`, err.message);
    throw err;
  }
}

// Send email - use Resend FIRST (PRIMARY), fallback to Nodemailer
async function sendEmail(to, subject, html) {
  try {
    // Try Resend first (PRIMARY)
    return await sendEmailViaResend(to, subject, html);
  } catch (resendErr) {
    console.error(`Resend failed, trying Nodemailer...`);
    try {
      // Fallback to Nodemailer if Resend fails
      return await sendEmailViaNodemailer(to, subject, html);
    } catch (nodemailerErr) {
      console.error(`Both services failed for ${to}`);
      throw resendErr; // Throw original Resend error
    }
  }
}

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    language TEXT DEFAULT 'en',
    subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'draft',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    sentAt DATETIME
  );

  CREATE TABLE IF NOT EXISTS monthly_stats (
    month TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );
`);

// Create default admin if not exists
const adminExists = db.prepare('SELECT * FROM admins WHERE email = ?').get('admin@example.com');
if (!adminExists) {
  db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
    'admin@example.com',
    'admin123',
    'Admin'
  );
}

const app = express();
app.use(cors());
app.use(express.json());

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

  try {
    const stmt = db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)');
    stmt.run(email, password, name);
    
    res.json({ 
      success: true, 
      user: { id: email, email, user_metadata: { name, role: 'admin' } }
    });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    res.status(500).json({ error: 'Failed to create admin account' });
  }
});

// ============= SUBSCRIBERS =============
app.post('/make-server-53bed28f/subscribers', async (req, res) => {
  const { email, language } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO subscribers (email, language) VALUES (?, ?)');
    stmt.run(email, language || 'en');
    
    // Update monthly stats
    const month = new Date().toISOString().slice(0, 7);
    const monthStmt = db.prepare('INSERT OR REPLACE INTO monthly_stats (month, count) VALUES (?, COALESCE((SELECT count FROM monthly_stats WHERE month = ?), 0) + 1)');
    monthStmt.run(month, month);

    // Send welcome email if configured
    if (process.env.RESEND_API_KEY || process.env.EMAIL_USER) {
      try {
        await sendEmail(
          email,
          'Welcome to the Journey!',
          getWelcomeEmailTemplate()
        );
        console.log(`✅ Welcome email sent to ${email}`);
      } catch (err) {
        console.error(`❌ Failed to send welcome email to ${email}:`, err.message);
      }
    }

    res.json({ success: true, subscriber: { email, language: language || 'en' } });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

app.get('/make-server-53bed28f/subscribers', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY subscribedAt DESC').all();
    res.json({ subscribers, total: subscribers.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

app.get('/make-server-53bed28f/subscribers/stats', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM subscribers').get().count;
    const active = Math.floor(total * 0.8);
    const monthlyStats = db.prepare('SELECT month, count FROM monthly_stats ORDER BY month ASC').all();

    res.json({
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: monthlyStats,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.delete('/make-server-53bed28f/subscribers/:email', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { email } = req.params;
    const stmt = db.prepare('DELETE FROM subscribers WHERE email = ?');
    const result = stmt.run(email);
    
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Subscriber not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

// ============= NEWSLETTERS =============
app.post('/make-server-53bed28f/newsletters', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, content, language } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const id = `newsletter-${Date.now()}`;
    const lang = language && language !== 'both' ? language : 'en';
    
    const stmt = db.prepare('INSERT INTO newsletters (id, title, content, language) VALUES (?, ?, ?, ?)');
    stmt.run(id, title, content, lang);
    
    res.json({ 
      success: true, 
      newsletter: { id, title, content, language: lang, status: 'draft' }
    });
  } catch (err) {
    console.error('Newsletter creation error:', err);
    res.status(500).json({ error: 'Failed to create newsletter: ' + err.message });
  }
});

app.get('/make-server-53bed28f/newsletters', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const newsletters = db.prepare('SELECT * FROM newsletters ORDER BY createdAt DESC').all();
    res.json({ newsletters });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

app.post('/make-server-53bed28f/newsletters/:id/send', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.params;
    const newsletter = db.prepare('SELECT * FROM newsletters WHERE id = ?').get(id);
    
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    // Get subscribers based on newsletter language
    let subscribers;
    if (newsletter.language === 'en' || newsletter.language === 'both') {
      subscribers = db.prepare('SELECT email FROM subscribers').all();
    } else if (newsletter.language === 'ar') {
      subscribers = db.prepare('SELECT email FROM subscribers WHERE language = ?').all('ar');
    } else {
      subscribers = db.prepare('SELECT email FROM subscribers WHERE language = ?').all(newsletter.language);
    }
    
    console.log(`Sending newsletter to ${subscribers.length} subscribers`);
    console.log(`API Key: ${process.env.UNOSEND_API_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`From Email: ${process.env.FROM_EMAIL}`);
    
    // Send to each subscriber with delay to avoid rate limiting
    const results = [];
    for (let i = 0; i < subscribers.length; i++) {
      const sub = subscribers[i];
      try {
        const result = await sendEmail(
          sub.email,
          newsletter.title,
          getEmailTemplate(newsletter.title, newsletter.content, 'newsletter')
        );
        console.log(`✅ Email sent to ${sub.email}:`, result.id);
        logEmail(sub.email, newsletter.title, newsletter.content, 'newsletter');
        results.push({ email: sub.email, success: true, id: result.id });
      } catch (err) {
        console.error(`❌ Error sending to ${sub.email}:`, err.message);
        results.push({ email: sub.email, success: false, error: err.message });
      }
      
      // Add delay between sends to avoid rate limiting (500ms = 2 requests per second)
      if (i < subscribers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const stmt = db.prepare('UPDATE newsletters SET status = ?, sentAt = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run('sent', id);
    
    const updated = db.prepare('SELECT * FROM newsletters WHERE id = ?').get(id);
    const successCount = results.filter(r => r.success).length;
    
    res.json({ success: true, newsletter: updated, recipientCount: subscribers.length, successCount });
  } catch (err) {
    console.error('Newsletter send error:', err);
    res.status(500).json({ error: 'Failed to send newsletter: ' + err.message });
  }
});

app.delete('/make-server-53bed28f/newsletters/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM newsletters WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Newsletter not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

// ============= EMAIL =============
app.post('/make-server-53bed28f/send-email', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { recipients, subject, content } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is required' });
    }

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    console.log(`Sending email to ${recipients.length} recipients`);
    console.log(`API Key: ${process.env.UNOSEND_API_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`From Email: ${process.env.FROM_EMAIL}`);
    
    // Send to each recipient with delay to avoid rate limiting
    const results = [];
    for (let i = 0; i < recipients.length; i++) {
      const email = recipients[i];
      try {
        const result = await sendEmail(
          email,
          subject,
          getEmailTemplate(subject, content, 'email')
        );
        console.log(`✅ Email sent to ${email}:`, result.id);
        logEmail(email, subject, content, 'email');
        results.push({ email, success: true, id: result.id });
      } catch (err) {
        console.error(`❌ Error sending to ${email}:`, err.message);
        results.push({ email, success: false, error: err.message });
      }
      
      // Add delay between sends to avoid rate limiting (500ms = 2 requests per second)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({ 
      success: true, 
      message: `Email sent to ${successCount} out of ${recipients.length} recipients`,
      recipientCount: recipients.length,
      successCount: successCount,
      results: results
    });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
});

app.get('/make-server-53bed28f/email-logs', (req, res) => {
  try {
    if (fs.existsSync(emailLogPath)) {
      const data = fs.readFileSync(emailLogPath, 'utf-8');
      const logs = JSON.parse(data);
      res.json({ logs });
    } else {
      res.json({ logs: [] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Admin API server running on http://localhost:${PORT}`);
  console.log(`Database: ${dbPath}`);
  console.log(`Email Service: Nodemailer & Resend`);
  console.log(`Primary Service: ${process.env.EMAIL_SERVICE_PROVIDER || 'Nodemailer'}`);
  console.log(`Gmail Account: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`\nTest admin credentials:`);
  console.log(`Email: admin@example.com`);
  console.log(`Password: admin123`);
});
