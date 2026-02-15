import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

// Validate environment variables
const requiredEnvVars = ['TURSO_CONNECTION_URL', 'TURSO_AUTH_TOKEN', 'EMAIL_USER', 'EMAIL_PASSWORD'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`[ERROR] Missing environment variables: ${missingVars.join(', ')}`);
  console.error('[ERROR] Please check your .env file');
  process.exit(1);
}

// Initialize Turso Database with retry logic
let db;
let dbConnected = false;

async function initTursoConnection(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DB] Connection attempt ${attempt}/${retries}...`);
      
      db = createClient({
        url: process.env.TURSO_CONNECTION_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      
      // Test connection with a simple query
      const result = await db.execute('SELECT 1 as test');
      if (result.rows && result.rows.length > 0) {
        dbConnected = true;
        console.log('[DB] ✓ Turso connection successful');
        return true;
      }
    } catch (err) {
      console.error(`[DB] Attempt ${attempt} failed:`, err.message);
      
      if (attempt < retries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        console.log(`[DB] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('[DB] ✗ Failed to connect to Turso after', retries, 'attempts');
  console.error('[DB] URL:', process.env.TURSO_CONNECTION_URL?.split('?')[0]);
  console.error('[DB] Token length:', process.env.TURSO_AUTH_TOKEN?.length);
  return false;
}

// Initialize Nodemailer with Gmail
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;

console.log(`[INIT] Email User: ${emailUser}`);
console.log(`[INIT] Email Pass Length: ${emailPass.length}`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
});

// Verify transporter connection with timeout and detailed logging
const verifyGmail = () => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.error('[GMAIL] ✗ Connection timeout (10s) - check network/firewall');
      resolve(false);
    }, 10000);

    transporter.verify((error, success) => {
      clearTimeout(timeout);
      if (error) {
        console.error('[GMAIL] ✗ Connection failed:', error.message);
        if (error.message.includes('Invalid login')) {
          console.error('[GMAIL] → Check EMAIL_USER and EMAIL_PASSWORD in .env');
        } else if (error.message.includes('ECONNREFUSED')) {
          console.error('[GMAIL] → Network error - check firewall/proxy settings');
        }
        resolve(false);
      } else {
        console.log('[GMAIL] ✓ Connection successful!');
        resolve(true);
      }
    });
  });
};

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

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database tables
async function initializeDatabase() {
  try {
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

// Verify password (supports both hashed and plain text)
async function verifyPassword(password, hash) {
  if (hash.startsWith('pbkdf2$')) {
    const parts = hash.split('$');
    if (parts.length === 4 && parts[0] === 'pbkdf2') {
      const [, iterations, salt, storedHash] = parts;
      const crypto_module = await import('crypto');
      const computedHash = crypto_module.pbkdf2Sync(
        password,
        salt,
        parseInt(iterations),
        64,
        'sha256'
      ).toString('hex');
      return computedHash === storedHash;
    }
  }
  return password === hash;
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

    const passwordValid = await verifyPassword(password, admin.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = Buffer.from(JSON.stringify({ id: admin.id, email: admin.email })).toString('base64');
    const refreshToken = Buffer.from(JSON.stringify({ id: admin.id, email: admin.email, type: 'refresh' })).toString('base64');

    res.json({
      success: true,
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: 900,
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

    if (!result.rows || result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAtMs = Date.now() + 3600000; // 1 hour from now
    const expiresAt = new Date(expiresAtMs).toISOString();

    console.log(`[RESET] Creating token for ${email}`);
    console.log(`[RESET] Token: ${resetToken.substring(0, 20)}...`);
    console.log(`[RESET] Expires at: ${expiresAt} (${expiresAtMs})`);

    await db.execute({
      sql: 'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
      args: [email, resetToken, expiresAtMs.toString()],
    });

    console.log(`[RESET] Token stored in database`);

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const emailContent = `
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p style="font-size: 14px; color: #7f8c8d;">This link expires in 1 hour.</p>
        <p style="font-size: 12px; color: #95a5a6;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    console.log(`[RESET] Reset link: ${resetLink}`);

    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: 'Password Reset Request',
      html: getEmailTemplate('Password Reset', emailContent),
    });

    console.log(`[RESET] Password reset email sent to ${email}`);

    // In development, return the token for testing
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
      ...(isDevelopment && { token: resetToken, resetLink }),
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

    console.log(`[RESET] Attempting to reset password with token: ${token?.substring(0, 20)}...`);

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    const result = await db.execute({
      sql: 'SELECT email, expires_at FROM password_reset_tokens WHERE token = ? AND CAST(expires_at AS INTEGER) > ?',
      args: [token, Date.now().toString()],
    });

    const now = Date.now();
    console.log(`[RESET] Current time: ${now}`);
    console.log(`[RESET] Query result rows: ${result.rows?.length || 0}`);

    if (!result.rows || result.rows.length === 0) {
      // Check if token exists but is expired
      const expiredCheck = await db.execute({
        sql: 'SELECT email, expires_at FROM password_reset_tokens WHERE token = ?',
        args: [token],
      });
      
      if (expiredCheck.rows && expiredCheck.rows.length > 0) {
        const expiresAt = parseInt(expiredCheck.rows[0].expires_at);
        const expiresDate = new Date(expiresAt).toISOString();
        console.log(`[RESET] Token found but expired`);
        console.log(`[RESET] Expires at: ${expiresDate} (${expiresAt})`);
        console.log(`[RESET] Current time: ${now}`);
        console.log(`[RESET] Difference: ${expiresAt - now}ms`);
      } else {
        console.log(`[RESET] Token not found in database`);
      }
      
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const resetRecord = result.rows[0];
    console.log(`[RESET] Token valid for: ${resetRecord.email}`);

    await db.execute({
      sql: 'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      args: [newPassword, resetRecord.email],
    });

    await db.execute({
      sql: 'DELETE FROM password_reset_tokens WHERE token = ?',
      args: [token],
    });

    console.log(`[RESET] Password reset successfully for ${resetRecord.email}`);

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
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const passwordValid = await verifyPassword(currentPassword, admin.password);
    if (!passwordValid) {
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

    // Send welcome email automatically
    const welcomeTemplate = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>أهلا بك في رسالة الرحلة</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; min-height: 100vh; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
          .header-icon { font-size: 48px; margin-bottom: 15px; }
          .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
          .header p { font-size: 16px; opacity: 0.95; font-weight: 300; }
          .content { padding: 40px 30px; text-align: right; }
          .welcome-section { margin-bottom: 30px; }
          .welcome-section h2 { color: #667eea; font-size: 24px; margin-bottom: 15px; font-weight: 600; }
          .welcome-section p { color: #333; font-size: 16px; line-height: 1.8; margin-bottom: 12px; }
          .features { background: #f8f9ff; border-right: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 6px; text-align: right; }
          .features h3 { color: #667eea; font-size: 16px; margin-bottom: 12px; font-weight: 600; }
          .features ul { list-style: none; padding: 0; }
          .features li { color: #555; font-size: 14px; padding: 8px 0; padding-right: 24px; position: relative; }
          .features li:before { content: "✓"; position: absolute; right: 0; color: #667eea; font-weight: bold; font-size: 16px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 25px 0; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6); }
          .divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
          .footer-text { color: #666; font-size: 13px; line-height: 1.6; margin-bottom: 15px; }
          .footer-links { margin: 15px 0; }
          .footer-links a { color: #667eea; text-decoration: none; font-size: 13px; margin: 0 10px; }
          .footer-links a:hover { text-decoration: underline; }
          .copyright { color: #999; font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
          .gmail-badge { display: inline-block; background: #ea4335; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">📧</div>
            <h1>الرحلة</h1>
            <p>تحديثات حصرية والوصول المبكر</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="gmail-badge">📬 النشرة الإخبارية</span>
            </div>
            <div class="welcome-section">
              <h2>أهلا بك! 🎉</h2>
              <p>شكراً لاشتراكك في نشرة <strong>الرحلة</strong> الإخبارية. نحن سعداء جداً بانضمامك إلينا!</p>
              <p>أنت الآن جزء من مجتمع حصري يحصل على وصول مبكر إلى أحدث التحديثات والرؤى والإعلانات الخاصة.</p>
            </div>
            <div class="features">
              <h3>ما ستحصل عليه:</h3>
              <ul>
                <li>وصول حصري مبكر إلى محتوى جديد</li>
                <li>رؤى وتحديثات أسبوعية</li>
                <li>عروض خاصة للمشتركين فقط</li>
                <li>قصص وتحديثات من وراء الكواليس</li>
                <li>وصول مباشر إلى مجتمعنا</li>
              </ul>
            </div>
            <div class="welcome-section">
              <p>نحن ملتزمون بإحضار محتوى قيم يهمك. توقع أن تسمع منا بانتظام مع تحديثات ستلهمك وتعلمك.</p>
              <p><strong>ترقب ما سيأتي بعد ذلك!</strong></p>
            </div>
            <div style="text-align: center;">
              <a href="https://thejourney.com" class="cta-button">استكشف الرحلة</a>
            </div>
            <div class="divider"></div>
            <div class="welcome-section">
              <h2 style="font-size: 18px; color: #333;">أسئلة؟</h2>
              <p>إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، فلا تتردد في التواصل معنا. نحن هنا للمساعدة!</p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">تتلقى هذا البريد الإلكتروني لأنك اشتركت في نشرتنا الإخبارية.</p>
            <div class="footer-links">
              <a href="#">إدارة التفضيلات</a>
              <span style="color: #ccc;">•</span>
              <a href="#">إلغاء الاشتراك</a>
            </div>
            <p class="copyright">© 2026 الرحلة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: emailUser,
        to: email,
        subject: 'Welcome to The Journey Newsletter! 🎉',
        html: welcomeTemplate,
      });
      console.log(`[WELCOME] Welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error(`[WELCOME] Failed to send welcome email to ${email}:`, emailErr.message);
      // Don't fail the subscription if email fails
    }

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

    // Get monthly breakdown
    const monthlyResult = await db.execute(`
      SELECT 
        strftime('%Y-%m', subscribedAt) as month,
        COUNT(*) as count
      FROM subscribers
      WHERE subscribedAt IS NOT NULL
      GROUP BY strftime('%Y-%m', subscribedAt)
      ORDER BY month ASC
    `);

    const monthlyStats = monthlyResult.rows || [];

    res.json({ 
      success: true, 
      stats: { 
        totalSubscribers: count,
        activeSubscribers: count,
        monthlyStats: monthlyStats
      } 
    });
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

    // Newsletter template (Arabic)
    const newsletterTemplate = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletter.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; min-height: 100vh; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; color: white; }
          .header-icon { font-size: 48px; margin-bottom: 15px; }
          .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
          .header p { font-size: 16px; opacity: 0.95; font-weight: 300; }
          .content { padding: 40px 30px; text-align: right; }
          .newsletter-badge { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; text-align: center; width: 100%; }
          .newsletter-title { color: #f5576c; font-size: 28px; margin-bottom: 20px; font-weight: 700; border-bottom: 3px solid #f093fb; padding-bottom: 15px; }
          .newsletter-content { color: #333; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
          .newsletter-content p { margin-bottom: 15px; }
          .featured-box { background: linear-gradient(135deg, #fff5f7 0%, #ffe5eb 100%); border-right: 4px solid #f5576c; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: right; }
          .featured-box h3 { color: #f5576c; margin-bottom: 10px; }
          .featured-box p { color: #555; font-size: 14px; line-height: 1.6; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 25px 0; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6); }
          .divider { height: 2px; background: linear-gradient(90deg, transparent, #f5576c, transparent); margin: 30px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
          .footer-text { color: #666; font-size: 13px; line-height: 1.6; margin-bottom: 15px; }
          .footer-links { margin: 15px 0; }
          .footer-links a { color: #f5576c; text-decoration: none; font-size: 13px; margin: 0 10px; }
          .footer-links a:hover { text-decoration: underline; }
          .copyright { color: #999; font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">📰</div>
            <h1>النشرة الإخبارية</h1>
            <p>أحدث التحديثات والأخبار</p>
          </div>
          <div class="content">
            <div class="newsletter-badge">📬 النشرة الإخبارية الأسبوعية</div>
            <div class="newsletter-title">${newsletter.title}</div>
            <div class="newsletter-content">
              ${newsletter.content.split('\\n').map(line => line.trim() ? '<p>' + line + '</p>' : '').join('')}
            </div>
            <div class="featured-box">
              <h3>✨ ملخص هذا الأسبوع</h3>
              <p>شكراً لك على متابعتك المستمرة. نتطلع إلى مشاركة المزيد من الأخبار والتحديثات معك قريباً!</p>
            </div>
            <div style="text-align: center;">
              <a href="https://thejourney.com" class="cta-button">اقرأ المزيد</a>
            </div>
            <div class="divider"></div>
            <div style="text-align: right; margin-top: 20px;">
              <p style="color: #666; font-size: 14px; line-height: 1.6;">هل لديك أفكار أو اقتراحات؟ نود أن نسمع منك! تواصل معنا عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي.</p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">تتلقى هذا البريد الإلكتروني لأنك مشترك في نشرتنا الإخبارية.</p>
            <div class="footer-links">
              <a href="#">إدارة التفضيلات</a>
              <span style="color: #ccc;">•</span>
              <a href="#">إلغاء الاشتراك</a>
            </div>
            <p class="copyright">© 2026 الرحلة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: emailUser,
      to: subscribers.join(','),
      subject: newsletter.title,
      html: newsletterTemplate,
    });

    await db.execute({
      sql: 'UPDATE newsletters SET status = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: ['sent', id],
    });

    console.log(`[NEWSLETTER] Newsletter sent to ${subscribers.length} subscribers`);
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

    // Gmail template (Arabic)
    const gmailTemplate = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 20px; min-height: 100vh; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); }
          .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 35px 20px; text-align: center; color: white; border-bottom: 4px solid #ea4335; }
          .header-icon { font-size: 40px; margin-bottom: 12px; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .content { padding: 35px 30px; text-align: right; }
          .message-title { color: #1e3c72; font-size: 22px; margin-bottom: 20px; font-weight: 600; border-bottom: 2px solid #ea4335; padding-bottom: 12px; }
          .message-body { color: #333; font-size: 15px; line-height: 1.8; margin-bottom: 20px; }
          .message-body p { margin-bottom: 15px; }
          .highlight-box { background: #f0f4ff; border-right: 4px solid #ea4335; padding: 20px; margin: 20px 0; border-radius: 6px; text-align: right; }
          .highlight-box p { color: #1e3c72; font-weight: 500; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #ea4335 0%, #c5221f 100%); color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 20px 0; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(234, 67, 53, 0.4); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(234, 67, 53, 0.6); }
          .divider { height: 1px; background: #e0e0e0; margin: 25px 0; }
          .footer { background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0; }
          .footer-text { color: #666; font-size: 12px; line-height: 1.6; margin-bottom: 12px; }
          .footer-links { margin: 12px 0; }
          .footer-links a { color: #ea4335; text-decoration: none; font-size: 12px; margin: 0 8px; }
          .footer-links a:hover { text-decoration: underline; }
          .copyright { color: #999; font-size: 11px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; }
          .gmail-badge { display: inline-block; background: #ea4335; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">📧</div>
            <h1>رسالة من الرحلة</h1>
            <p>رسالة خاصة لمشتركينا الكرام</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="gmail-badge">📬 رسالة Gmail</span>
            </div>
            <div class="message-title">${subject}</div>
            <div class="message-body">
              ${content.split('\\n').map(line => line.trim() ? '<p>' + line + '</p>' : '').join('')}
            </div>
            <div class="highlight-box">
              <p>شكراً لك على كونك جزءاً من مجتمعنا!</p>
            </div>
            <div class="divider"></div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://thejourney.com" class="cta-button">زيارة موقعنا</a>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">تتلقى هذا البريد الإلكتروني لأنك مشترك في قائمتنا البريدية.</p>
            <div class="footer-links">
              <a href="#">إدارة التفضيلات</a>
              <span style="color: #ccc;">•</span>
              <a href="#">إلغاء الاشتراك</a>
            </div>
            <p class="copyright">© 2026 الرحلة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: emailUser,
      to: recipients.join(','),
      subject,
      html: gmailTemplate,
    });

    console.log(`[EMAIL] Gmail message sent to ${recipients.length} recipients`);
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
    // Initialize Turso connection first
    const dbConnected = await initTursoConnection();
    if (!dbConnected) {
      console.error('[FATAL] Failed to connect to Turso database. Exiting.');
      process.exit(1);
    }

    // Verify Gmail connection
    const gmailConnected = await verifyGmail();
    if (!gmailConnected) {
      console.warn('[WARN] Gmail connection verification failed. Email sending may not work.');
    }

    // Initialize database tables
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✓ Admin API server running on http://localhost:${PORT}`);
      console.log(`✓ Database: Turso (${process.env.TURSO_CONNECTION_URL?.split('?')[0]})`);
      console.log(`✓ Email Service: Nodemailer (Gmail SMTP)`);
      console.log(`✓ Gmail Account: ${emailUser}`);
      console.log(`✓ Server ready to accept requests\n`);
    });
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
}

start();
