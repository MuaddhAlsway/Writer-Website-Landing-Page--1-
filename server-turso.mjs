import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

// Initialize Turso Database
const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize Nodemailer with Gmail
const emailUser = process.env.EMAIL_USER || 'muaddhalsway@gmail.com';
const emailPass = process.env.EMAIL_PASSWORD || 'bovnptattnqmehhp';

console.log(`[INIT] Email User: ${emailUser}`);
console.log(`[INIT] Email Pass Length: ${emailPass.length}`);
console.log(`[INIT] Email Pass (first 5 chars): ${emailPass.substring(0, 5)}...`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('[VERIFY] Gmail connection failed:', error.message);
  } else {
    console.log('[VERIFY] Gmail connection successful!');
  }
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
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { margin: 20px 0; }
        .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${htmlContent}
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        username TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        language TEXT DEFAULT 'en',
        subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en',
        status TEXT NOT NULL DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sent_at DATETIME
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('[DB] Tables initialized successfully');
  } catch (err) {
    console.error('[DB] Error initializing tables:', err.message);
  }
}

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await db.execute({
      sql: 'SELECT id, email, password, name, username FROM admins WHERE email = ?',
      args: [email],
    });

    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if password is hashed (pbkdf2) or plain text
    let passwordValid = false;
    if (admin.password.startsWith('pbkdf2$')) {
      // Verify hashed password
      const parts = admin.password.split('$');
      if (parts.length === 4 && parts[0] === 'pbkdf2') {
        const [, iterations, salt, storedHash] = parts;
        const crypto = await import('crypto');
        const computedHash = crypto.pbkdf2Sync(
          password,
          salt,
          parseInt(iterations),
          64,
          'sha256'
        ).toString('hex');
        passwordValid = computedHash === storedHash;
      }
    } else {
      // Plain text comparison (for simple passwords like "admin123")
      passwordValid = admin.password === password;
    }

    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create token (base64 encoded JSON)
    const token = Buffer.from(JSON.stringify({ id: admin.id, email: admin.email })).toString('base64');

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Admin Profile
app.get('/api/admin/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const result = await db.execute({
      sql: 'SELECT id, email, username, name, created_at FROM admins WHERE id = ?',
      args: [decoded.id],
    });

    const admin = result.rows[0];
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ success: true, admin });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Admin Profile
app.put('/api/admin/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { email, username, name } = req.body;

    if (email) {
      await db.execute({
        sql: 'UPDATE admins SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [email, decoded.id],
      });
    }

    if (username) {
      await db.execute({
        sql: 'UPDATE admins SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [username, decoded.id],
      });
    }

    if (name) {
      await db.execute({
        sql: 'UPDATE admins SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [name, decoded.id],
      });
    }

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Request Password Reset
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const result = await db.execute({
      sql: 'SELECT id FROM admins WHERE email = ?',
      args: [email],
    });

    // Always return success to prevent email enumeration
    if (!result.rows || result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Store reset token in database
    await db.execute({
      sql: 'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
      args: [email, resetToken, expiresAt],
    });

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const emailContent = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: 'Password Reset Request',
      html: getEmailTemplate('Password Reset', emailContent),
    });

    console.log(`[RESET] Password reset email sent to ${email}`);

    res.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Request failed' });
  }
});

// Reset Password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    // Find valid reset token
    const result = await db.execute({
      sql: 'SELECT email FROM password_reset_tokens WHERE token = ? AND expires_at > datetime("now")',
      args: [token],
    });

    if (!result.rows || result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const resetRecord = result.rows[0];

    // Update password
    await db.execute({
      sql: 'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      args: [newPassword, resetRecord.email],
    });

    // Delete used reset token
    await db.execute({
      sql: 'DELETE FROM password_reset_tokens WHERE token = ?',
      args: [token],
    });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Reset failed' });
  }
});

// Change Password
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    const result = await db.execute({
      sql: 'SELECT password FROM admins WHERE id = ?',
      args: [decoded.id],
    });

    const admin = result.rows[0];
    if (!admin || admin.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    await db.execute({
      sql: 'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [newPassword, decoded.id],
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get Subscribers
app.get('/make-server-53bed28f/subscribers', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM subscribers');
    res.json({ success: true, subscribers: result.rows });
  } catch (err) {
    console.error('Get subscribers error:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Add Subscriber
app.post('/make-server-53bed28f/subscribers', async (req, res) => {
  try {
    const { email, language } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    await db.execute({
      sql: 'INSERT INTO subscribers (email, language) VALUES (?, ?)',
      args: [email, language || 'en'],
    });

    res.json({ success: true, message: 'Subscriber added' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    console.error('Add subscriber error:', err);
    res.status(500).json({ error: 'Failed to add subscriber' });
  }
});

// Delete Subscriber
app.delete('/make-server-53bed28f/subscribers/:email', async (req, res) => {
  try {
    const { email } = req.params;

    await db.execute({
      sql: 'DELETE FROM subscribers WHERE email = ?',
      args: [email],
    });

    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (err) {
    console.error('Delete subscriber error:', err);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

// Get Subscriber Stats
app.get('/make-server-53bed28f/subscribers/stats', async (req, res) => {
  try {
    const result = await db.execute('SELECT COUNT(*) as count FROM subscribers');
    const count = result.rows[0]?.count || 0;

    res.json({ success: true, stats: { totalSubscribers: count } });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get Newsletters
app.get('/make-server-53bed28f/newsletters', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM newsletters ORDER BY created_at DESC');
    res.json({ success: true, newsletters: result.rows });
  } catch (err) {
    console.error('Get newsletters error:', err);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

// Create Newsletter
app.post('/make-server-53bed28f/newsletters', async (req, res) => {
  try {
    const { title, content, language } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const id = crypto.randomUUID();

    await db.execute({
      sql: 'INSERT INTO newsletters (id, title, content, language) VALUES (?, ?, ?, ?)',
      args: [id, title, content, language || 'en'],
    });

    res.json({ success: true, message: 'Newsletter created', id });
  } catch (err) {
    console.error('Create newsletter error:', err);
    res.status(500).json({ error: 'Failed to create newsletter' });
  }
});

// Send Newsletter
app.post('/make-server-53bed28f/newsletters/:id/send', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute({
      sql: 'SELECT * FROM newsletters WHERE id = ?',
      args: [id],
    });

    const newsletter = result.rows[0];
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    const subscribersResult = await db.execute('SELECT email FROM subscribers');
    const subscribers = subscribersResult.rows.map(s => s.email);

    if (subscribers.length === 0) {
      return res.json({ success: true, message: 'No subscribers to send to' });
    }

    const htmlContent = getEmailTemplate(newsletter.title, newsletter.content);

    await transporter.sendMail({
      from: emailUser,
      to: subscribers.join(','),
      subject: newsletter.title,
      html: htmlContent,
    });

    await db.execute({
      sql: 'UPDATE newsletters SET status = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: ['sent', id],
    });

    res.json({ success: true, message: 'Newsletter sent', count: subscribers.length });
  } catch (err) {
    console.error('Send newsletter error:', err);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// Delete Newsletter
app.delete('/make-server-53bed28f/newsletters/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute({
      sql: 'DELETE FROM newsletters WHERE id = ?',
      args: [id],
    });

    res.json({ success: true, message: 'Newsletter deleted' });
  } catch (err) {
    console.error('Delete newsletter error:', err);
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

// Send Email
app.post('/make-server-53bed28f/send-email', async (req, res) => {
  try {
    const { recipients, subject, content } = req.body;

    if (!recipients || !subject || !content) {
      return res.status(400).json({ error: 'Recipients, subject, and content required' });
    }

    const htmlContent = getEmailTemplate(subject, content);

    await transporter.sendMail({
      from: emailUser,
      to: recipients.join(','),
      subject,
      html: htmlContent,
    });

    res.json({ success: true, message: 'Email sent', count: recipients.length });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize and start server
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Admin API server running on http://localhost:${PORT}`);
      console.log(`Database: Turso (${process.env.TURSO_CONNECTION_URL})`);
      console.log(`Email Service: Nodemailer (Gmail SMTP)`);
      console.log(`Gmail Account: ${emailUser}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
