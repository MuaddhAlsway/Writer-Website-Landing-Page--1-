import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gmail credentials
const emailUser = process.env.EMAIL_USER || 'AuthorFSK@gmail.com';
const emailPassword = process.env.EMAIL_PASSWORD || 'peed qvhs ekmo kisv';

console.log(`\n📧 Email Configuration:`);
console.log(`   User: ${emailUser}`);
console.log(`   Password length: ${emailPassword.length} chars`);
console.log(`   Service: Gmail SMTP\n`);

// Initialize Turso Database
const db = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

console.log(`\n🗄️  Database Configuration:`);
console.log(`   URL: ${process.env.TURSO_CONNECTION_URL || 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io'}`);
console.log(`   Status: Connecting...\n`);

// Create Gmail transporter with app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail connection error:', error.message);
  } else {
    console.log('✅ Gmail SMTP connection successful');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-backend', database: 'turso' });
});

// Get subscribers from Turso
app.get('/make-server-53bed28f/subscribers', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC LIMIT 100');
    const subscribers = result.rows.map(row => ({
      email: row.email,
      name: row.name || '',
      language: row.language || 'en',
      subscribedAt: row.subscribedAt || new Date().toISOString(),
    }));

    res.json({
      success: true,
      subscribers: subscribers,
    });
  } catch (err) {
    console.error('Get subscribers error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add subscriber to Turso
app.post('/make-server-53bed28f/subscribers', async (req, res) => {
  try {
    const { email, language } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Check if already exists
    const existing = await db.execute('SELECT * FROM subscribers WHERE email = ?', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    // Insert new subscriber
    await db.execute(
      'INSERT INTO subscribers (email, language, subscribedAt) VALUES (?, ?, ?)',
      [email, language || 'en', new Date().toISOString()]
    );

    res.json({ success: true, message: 'Subscriber added' });
  } catch (err) {
    console.error('Add subscriber error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send email endpoint
app.post('/make-server-53bed28f/send-email', async (req, res) => {
  try {
    const { recipients, subject, content, language } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients required' });
    }

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content required' });
    }

    console.log(`\n📨 Sending email:`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Recipients: ${recipients.join(', ')}`);
    console.log(`   Language: ${language || 'en'}`);

    let sentCount = 0;
    const errors = [];

    // Send to each recipient
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: emailUser,
          to: recipient,
          subject: subject,
          html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        sentCount++;
        console.log(`   ✅ Sent to ${recipient} (ID: ${info.messageId})`);
      } catch (err) {
        console.error(`   ❌ Error sending to ${recipient}:`, err.message);
        errors.push(`${recipient}: ${err.message}`);
      }
    }

    console.log(`\n📊 Result: ${sentCount}/${recipients.length} emails sent\n`);

    res.json({
      success: sentCount > 0,
      message: `Email sent to ${sentCount} recipient(s)`,
      recipientCount: sentCount,
      totalRecipients: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get newsletters from Turso
app.get('/make-server-53bed28f/newsletters', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM newsletters ORDER BY createdAt DESC LIMIT 100');
    const newsletters = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      language: row.language || 'en',
      status: row.status || 'draft',
      createdAt: row.createdAt,
      sentAt: row.sentAt,
    }));

    res.json({
      success: true,
      newsletters: newsletters,
    });
  } catch (err) {
    console.error('Get newsletters error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create newsletter in Turso
app.post('/make-server-53bed28f/newsletters', async (req, res) => {
  try {
    const { title, content, language } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const id = 'nl-' + Date.now();
    await db.execute(
      'INSERT INTO newsletters (id, title, content, language, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, title, content, language || 'en', 'draft', new Date().toISOString()]
    );

    res.json({ success: true, message: 'Newsletter created', id });
  } catch (err) {
    console.error('Create newsletter error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send newsletter
app.post('/make-server-53bed28f/newsletters/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { recipients, subject, content } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients required' });
    }

    console.log(`\n📰 Sending newsletter:`);
    console.log(`   ID: ${id}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Recipients: ${recipients.length}`);

    let sentCount = 0;
    const errors = [];

    for (const recipient of recipients) {
      try {
        const info = await transporter.sendMail({
          from: emailUser,
          to: recipient,
          subject: subject,
          html: content,
        });
        sentCount++;
        console.log(`   ✅ Sent to ${recipient}`);
      } catch (err) {
        console.error(`   ❌ Error sending to ${recipient}:`, err.message);
        errors.push(`${recipient}: ${err.message}`);
      }
    }

    // Update newsletter status in Turso
    await db.execute(
      'UPDATE newsletters SET status = ?, sentAt = ? WHERE id = ?',
      ['sent', new Date().toISOString(), id]
    );

    console.log(`\n📊 Newsletter result: ${sentCount}/${recipients.length} sent\n`);

    res.json({
      success: true,
      message: 'Newsletter sent',
      count: sentCount,
      recipientCount: sentCount,
      totalRecipients: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Newsletter send error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on port ${PORT}`);
  console.log(`📧 Email service: Gmail SMTP`);
  console.log(`👤 Email user: ${emailUser}`);
  console.log(`🗄️  Database: Turso`);
  console.log(`✓ Ready to send emails\n`);
});
