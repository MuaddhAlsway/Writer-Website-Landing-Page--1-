import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'admin.db');
const emailLogPath = path.join(__dirname, 'email-log.json');

// Initialize Nodemailer with Gmail
const emailUser = process.env.EMAIL_USER || 'muaddhalsway@gmail.com';
const emailPass = process.env.EMAIL_PASSWORD || 'bovnptattnqmehhpmy';

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

// Send email - use Nodemailer (Gmail) only
async function sendEmail(to, subject, html) {
  return await sendEmailViaNodemailer(to, subject, html);
}

// ============= PASSWORD HASHING =============
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

function verifyPassword(password, hash) {
  try {
    const parts = hash.split('$');
    if (parts.length < 4) return false;
    
    const [, iterations, salt, storedHash] = parts;
    const keylen = 64;
    const digest = 'sha256';
    
    const computedHash = crypto.pbkdf2Sync(
      password,
      salt,
      parseInt(iterations),
      keylen,
      digest
    ).toString('hex');
    
    return computedHash === storedHash;
  } catch (err) {
    return false;
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

// ============= ADMIN AUTHENTICATION ENDPOINTS =============

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const admin = db.prepare('SELECT id, email, password, name FROM admins WHERE email = ?').get(email);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password using PBKDF2
    const passwordValid = verifyPassword(password, admin.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate simple JWT tokens
    const accessToken = Buffer.from(JSON.stringify({ email, id: admin.id, type: 'access', exp: Date.now() + 900000 })).toString('base64');
    const refreshToken = Buffer.from(JSON.stringify({ email, id: admin.id, type: 'refresh', exp: Date.now() + 604800000 })).toString('base64');

    res.json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 900,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot Password
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const admin = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);

    // Always return success (don't reveal if email exists)
    if (!admin) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Store reset token in database
    db.prepare('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)').run(
      email,
      resetToken,
      expiresAt
    );

    // Create reset link
    const resetLink = `${req.get('origin')}/admin/reset-password?token=${resetToken}`;

    // Send email with reset link
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إعادة تعيين كلمة المرور</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            min-height: 100vh;
          }
          .wrapper { max-width: 650px; margin: 0 auto; }
          .container { 
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 70px 40px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: -50%;
            left: -50%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
          }
          .header-content {
            position: relative;
            z-index: 1;
          }
          .header-icon {
            font-size: 48px;
            margin-bottom: 15px;
            display: block;
          }
          .header h1 { 
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .header p { 
            font-size: 16px;
            opacity: 0.95;
            font-weight: 300;
          }
          .content { 
            padding: 60px 40px;
            color: #1f2937;
            line-height: 1.9;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .description {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .cta-wrapper {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 18px 50px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.35);
            border: none;
            cursor: pointer;
          }
          .cta-button:hover { 
            transform: translateY(-3px);
            box-shadow: 0 18px 45px rgba(102, 126, 234, 0.5);
          }
          .cta-button:active {
            transform: translateY(-1px);
          }
          .alternative-text {
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            margin: 25px 0;
          }
          .link-section { 
            background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
            padding: 24px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 5px solid #667eea;
          }
          .link-label { 
            font-size: 13px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .link-text { 
            word-break: break-all;
            background: white;
            padding: 14px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #667eea;
            border: 1px solid #e0e7ff;
            line-height: 1.6;
          }
          .features { 
            margin: 35px 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .feature { 
            background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e0e7ff;
            transition: all 0.3s ease;
          }
          .feature:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
          }
          .feature-icon { 
            font-size: 32px;
            margin-bottom: 10px;
            display: block;
          }
          .feature-text { 
            font-size: 14px;
            color: #4b5563;
            font-weight: 600;
          }
          .security-alert { 
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #fcd34d;
            padding: 24px;
            border-radius: 12px;
            margin: 30px 0;
            color: #78350f;
          }
          .security-alert strong { 
            display: block;
            margin-bottom: 12px;
            font-size: 16px;
            color: #92400e;
          }
          .security-alert ul {
            list-style: none;
            padding: 0;
          }
          .security-alert li {
            padding: 6px 0;
            font-size: 14px;
            line-height: 1.6;
          }
          .security-alert li::before {
            content: '✓ ';
            color: #d97706;
            font-weight: bold;
            margin-left: 8px;
          }
          .divider { 
            height: 2px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 35px 0;
          }
          .help-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.8;
            background: #f9fafb;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .footer { 
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
            font-size: 15px;
          }
          .footer p { 
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            line-height: 1.6;
          }
          .footer-links { 
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-links a { 
            color: #667eea;
            text-decoration: none;
            font-size: 13px;
            margin: 0 12px;
            font-weight: 500;
            transition: color 0.2s;
          }
          .footer-links a:hover { 
            color: #764ba2;
            text-decoration: underline;
          }
          .copyright { 
            margin-top: 20px;
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.6;
          }
          @media (max-width: 600px) {
            .content { padding: 40px 25px; }
            .header { padding: 50px 25px; }
            .features { grid-template-columns: 1fr; }
            .header h1 { font-size: 28px; }
            .cta-button { padding: 16px 40px; font-size: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="header-content">
                <span class="header-icon">🔐</span>
                <h1>إعادة تعيين كلمة المرور</h1>
                <p>طلب آمن لحماية حسابك</p>
              </div>
            </div>
            
            <div class="content">
              <div class="greeting">مرحبا بك! 👋</div>
              <p class="description">
                لقد تلقينا طلب إعادة تعيين كلمة المرور لحسابك. لحماية أمان حسابك، يرجى النقر على الزر أدناه لإنشاء كلمة مرور جديدة قوية.
              </p>
              
              <div class="cta-wrapper">
                <a href="${resetLink}" class="cta-button">إعادة تعيين كلمة المرور الآن</a>
              </div>
              
              <p class="alternative-text">أو انسخ والصق الرابط أدناه في متصفحك</p>
              
              <div class="link-section">
                <div class="link-label">رابط إعادة التعيين</div>
                <div class="link-text">${resetLink}</div>
              </div>
              
              <div class="features">
                <div class="feature">
                  <span class="feature-icon">🔒</span>
                  <div class="feature-text">محمي بالتشفير</div>
                </div>
                <div class="feature">
                  <span class="feature-icon">⏱️</span>
                  <div class="feature-text">ينتهي خلال ساعة</div>
                </div>
              </div>
              
              <div class="security-alert">
                <strong>⚠️ تنبيه أمان مهم</strong>
                <ul>
                  <li>سينتهي هذا الرابط بعد ساعة واحدة فقط</li>
                  <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
                  <li>إذا لم تطلب هذا، تجاهل هذا البريد الإلكتروني فوراً</li>
                  <li>تأكد من أن حسابك آمن بكلمة مرور قوية</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <div class="help-text">
                <strong>هل واجهت مشكلة؟</strong><br>
                إذا لم تتمكن من النقر على الزر، يمكنك نسخ الرابط أعلاه والصقه مباشرة في شريط عنوان متصفحك. تأكد من نسخ الرابط بالكامل.
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-title">هل تحتاج إلى مساعدة؟</div>
              <p>إذا كان لديك أي أسئلة أو مخاوف بشأن أمان حسابك، يرجى التواصل معنا على الفور.</p>
              <div class="footer-links">
                <a href="#">📧 اتصل بنا</a> • 
                <a href="#">🔒 سياسة الخصوصية</a> • 
                <a href="#">📋 الشروط والأحكام</a>
              </div>
              <p class="copyright">
                &copy; 2026 جميع الحقوق محفوظة<br>
                هذا بريد إلكتروني آلي، يرجى عدم الرد على هذا البريد<br>
                تم إرسال هذا البريد لأسباب أمنية
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail(email, 'إعادة تعيين كلمة المرور', emailHtml);
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (emailErr) {
      console.error(`❌ Failed to send reset email to ${email}:`, emailErr.message);
    }

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

    if (newPassword.length < 12) {
      return res.status(400).json({ error: 'Password must be at least 12 characters' });
    }

    // Find valid reset token
    const resetRecord = db.prepare(
      "SELECT email FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')"
    ).get(token);

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = hashPassword(newPassword);

    // Update admin password
    db.prepare('UPDATE admins SET password = ? WHERE email = ?').run(
      hashedPassword,
      resetRecord.email
    );

    // Delete used reset token
    db.prepare('DELETE FROM password_reset_tokens WHERE token = ?').run(token);

    res.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
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

    const admin = db.prepare('SELECT password FROM admins WHERE id = ?').get(decoded.id);
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const passwordValid = verifyPassword(currentPassword, admin.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = hashPassword(newPassword);
    db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hashedPassword, decoded.id);

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Change password failed' });
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

    const admin = db.prepare('SELECT id, email, username, name, created_at FROM admins WHERE id = ?').get(decoded.id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ 
      success: true, 
      admin: admin 
    });
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

    if (!email && !username && !name) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    // Check if username is already taken
    if (username) {
      const existing = db.prepare('SELECT id FROM admins WHERE username = ? AND id != ?').get(username, decoded.id);
      if (existing) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Check if email is already taken
    if (email) {
      const existing = db.prepare('SELECT id FROM admins WHERE email = ? AND id != ?').get(email, decoded.id);
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updates = [];
    const values = [];

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    values.push(decoded.id);

    try {
      // If updating email, delete old password reset tokens first
      if (email) {
        const oldAdmin = db.prepare('SELECT email FROM admins WHERE id = ?').get(decoded.id);
        if (oldAdmin && oldAdmin.email !== email) {
          db.prepare('DELETE FROM password_reset_tokens WHERE email = ?').run(oldAdmin.email);
        }
      }

      db.prepare(
        `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`
      ).run(...values);
    } catch (dbErr) {
      console.error('Database update error:', dbErr.message);
      return res.status(400).json({ error: 'Failed to update: ' + dbErr.message });
    }

    // Return updated profile
    const updated = db.prepare('SELECT id, email, username, name, createdAt FROM admins WHERE id = ?').get(decoded.id);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      admin: updated
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Update failed: ' + err.message });
  }
});

// Refresh Token
app.post('/api/admin/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(refreshToken, 'base64').toString());
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    const newAccessToken = Buffer.from(JSON.stringify({ email: decoded.email, id: decoded.id, type: 'access', exp: Date.now() + 900000 })).toString('base64');

    res.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: 900,
    });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Logout
app.post('/api/admin/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
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
  console.log(`Email Service: Nodemailer (Gmail SMTP)`);
  console.log(`Gmail Account: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`\nTest admin credentials:`);
  console.log(`Email: admin@example.com`);
  console.log(`Password: admin123`);
});
