import { Router } from 'itty-router';
import { Resend } from 'resend';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = Router();

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

interface JWTPayload {
  email: string;
  id: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

// ============= SECURITY UTILITIES =============

// Password validation
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 12) errors.push('Password must be at least 12 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character (!@#$%^&*)');
  
  return { valid: errors.length === 0, errors };
}

// Hash password with bcrypt-like approach using crypto (for Cloudflare Workers compatibility)
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `${iterations}$${salt}$${hash}`;
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [iterations, salt, storedHash] = hash.split('$');
    const keylen = 64;
    const digest = 'sha256';
    
    const computedHash = crypto.pbkdf2Sync(password, salt, parseInt(iterations), keylen, digest).toString('hex');
    return computedHash === storedHash;
  } catch (err) {
    return false;
  }
}

// Generate secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate JWT tokens
function generateAccessToken(email: string, id: string, secret: string): string {
  return jwt.sign(
    { email, id, type: 'access' },
    secret,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}

function generateRefreshToken(email: string, id: string, secret: string): string {
  return jwt.sign(
    { email, id, type: 'refresh' },
    secret,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

// Verify JWT
function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as JWTPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

// Rate limiting helper
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(email);
  
  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(email, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (attempt.count >= maxAttempts) {
    return false;
  }
  
  attempt.count++;
  return true;
}

// Security headers helper
function getSecurityHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
  };
}

// Email template helper
function getEmailTemplate(title: string, content: string, type = 'newsletter'): string {
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
function getWelcomeEmailTemplate(): string {
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

// Password reset email template
function getPasswordResetEmailTemplate(resetLink: string): string {
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
          border-bottom: 2px solid #d32f2f;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #d32f2f;
        }
        .content {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          background-color: #d32f2f;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          padding: 10px;
          border-radius: 4px;
          margin: 15px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send email via Resend
async function sendEmailViaResend(env: Env, to: string, subject: string, html: string) {
  const resend = new Resend(env.RESEND_API_KEY);
  
  try {
    const result = await resend.emails.send({
      from: env.FROM_EMAIL || 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true, id: result.data.id, service: 'resend' };
  } catch (err: any) {
    console.error(`Error sending via Resend to ${to}:`, err.message);
    throw err;
  }
}

// Health check
router.get('/make-server-53bed28f/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// ============= ADMIN AUTHENTICATION =============

// Admin Login
router.post('/api/admin/login', async (req, env: Env) => {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM admins WHERE email = ?'
    ).bind(email).all();

    const admin = results?.[0];
    if (!admin || admin.password !== hashPassword(password)) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secret = env.JWT_SECRET || 'your-secret-key';
    const token = generateJWT(email, secret);

    return new Response(JSON.stringify({
      success: true,
      token,
      expiresIn: 3600,
      admin: { id: admin.id, email: admin.email, name: admin.name, username: admin.username }
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Login failed: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Request Password Reset
router.post('/api/admin/forgot-password', async (req, env: Env) => {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM admins WHERE email = ?'
    ).bind(email).all();

    if (!results || results.length === 0) {
      // Don't reveal if email exists
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'If an account exists, a reset link has been sent' 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resetToken = generateToken();
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await env.DB.prepare(
      'INSERT INTO password_reset_tokens (email, token, expiresAt) VALUES (?, ?, ?)'
    ).bind(email, resetToken, expiresAt).run();

    const resetLink = `${new URL(req.url).origin}/admin/reset-password?token=${resetToken}`;

    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Password Reset Request',
        html: getPasswordResetEmailTemplate(resetLink),
      });
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password reset link sent to email' 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Request failed: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Reset Password
router.post('/api/admin/reset-password', async (req, env: Env) => {
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return new Response(JSON.stringify({ error: 'Token and new password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expiresAt > datetime("now")'
    ).bind(token).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or expired reset token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resetRecord = results[0];
    const hashedPassword = hashPassword(newPassword);

    await env.DB.prepare(
      'UPDATE admins SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?'
    ).bind(hashedPassword, resetRecord.email).run();

    await env.DB.prepare(
      'DELETE FROM password_reset_tokens WHERE token = ?'
    ).bind(token).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password reset successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Reset failed: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get Admin Profile
router.get('/api/admin/profile', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secret = env.JWT_SECRET || 'your-secret-key';
    const decoded = verifyJWT(token, secret);

    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT id, email, name, username, createdAt FROM admins WHERE email = ?'
    ).bind(decoded.email).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Admin not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      admin: results[0] 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch profile: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Update Admin Profile
router.put('/api/admin/profile', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secret = env.JWT_SECRET || 'your-secret-key';
    const decoded = verifyJWT(token, secret);

    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email, username, name } = await req.json();

    if (username) {
      const { results } = await env.DB.prepare(
        'SELECT * FROM admins WHERE username = ? AND email != ?'
      ).bind(username, decoded.email).all();

      if (results && results.length > 0) {
        return new Response(JSON.stringify({ error: 'Username already taken' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const updates = [];
    const values = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(decoded.email);

    await env.DB.prepare(
      `UPDATE admins SET ${updates.join(', ')} WHERE email = ?`
    ).bind(...values).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Profile updated successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Update failed: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Change Password
router.post('/api/admin/change-password', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secret = env.JWT_SECRET || 'your-secret-key';
    const decoded = verifyJWT(token, secret);

    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Current and new password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'New password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM admins WHERE email = ?'
    ).bind(decoded.email).all();

    const admin = results?.[0];
    if (!admin || admin.password !== hashPassword(currentPassword)) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = hashPassword(newPassword);
    await env.DB.prepare(
      'UPDATE admins SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?'
    ).bind(hashedPassword, decoded.email).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password changed successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Change password failed: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// ============= SUBSCRIBERS =============
router.post('/make-server-53bed28f/subscribers', async (req, env: Env) => {
  try {
    const { email, language } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert subscriber
    const result = await env.DB.prepare(
      'INSERT INTO subscribers (email, language) VALUES (?, ?)'
    ).bind(email, language || 'en').run();

    // Send welcome email
    try {
      await sendEmailViaResend(
        env,
        email,
        'Welcome to the Journey!',
        getWelcomeEmailTemplate()
      );
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send welcome email to ${email}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      subscriber: { email, language: language || 'en' } 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'Already subscribed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get subscribers
router.get('/make-server-53bed28f/subscribers', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM subscribers ORDER BY subscribedAt DESC'
    ).all();

    return new Response(JSON.stringify({ 
      subscribers: results, 
      total: results?.length || 0 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get subscriber stats
router.get('/make-server-53bed28f/subscribers/stats', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results: countResult } = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM subscribers'
    ).all();

    const total = countResult?.[0]?.count || 0;
    const active = Math.floor(total * 0.8);

    return new Response(JSON.stringify({
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Delete subscriber
router.delete('/make-server-53bed28f/subscribers/:email', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email } = req.params;
    await env.DB.prepare('DELETE FROM subscribers WHERE email = ?').bind(email).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete subscriber' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Create newsletter
router.post('/make-server-53bed28f/newsletters', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, content, language } = await req.json();
    
    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `newsletter-${Date.now()}`;
    const lang = language && language !== 'both' ? language : 'en';

    await env.DB.prepare(
      'INSERT INTO newsletters (id, title, content, language) VALUES (?, ?, ?, ?)'
    ).bind(id, title, content, lang).run();

    return new Response(JSON.stringify({ 
      success: true, 
      newsletter: { id, title, content, language: lang, status: 'draft' }
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to create newsletter: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get newsletters
router.get('/make-server-53bed28f/newsletters', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM newsletters ORDER BY createdAt DESC'
    ).all();

    return new Response(JSON.stringify({ newsletters: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch newsletters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Send newsletter
router.post('/make-server-53bed28f/newsletters/:id/send', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = req.params;
    const { results: newsletters } = await env.DB.prepare(
      'SELECT * FROM newsletters WHERE id = ?'
    ).bind(id).all();

    const newsletter = newsletters?.[0];
    if (!newsletter) {
      return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results: subscribers } = await env.DB.prepare(
      'SELECT email FROM subscribers'
    ).all();

    console.log(`Sending newsletter to ${subscribers?.length || 0} subscribers`);

    const results = [];
    for (let i = 0; i < (subscribers?.length || 0); i++) {
      const sub = subscribers[i];
      try {
        const result = await sendEmailViaResend(
          env,
          sub.email,
          newsletter.title,
          getEmailTemplate(newsletter.title, newsletter.content, 'newsletter')
        );
        console.log(`✅ Email sent to ${sub.email}:`, result.id);
        results.push({ email: sub.email, success: true, id: result.id });
      } catch (err: any) {
        console.error(`❌ Error sending to ${sub.email}:`, err.message);
        results.push({ email: sub.email, success: false, error: err.message });
      }
      
      // Rate limiting: 500ms delay between sends
      if (i < (subscribers?.length || 0) - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    await env.DB.prepare(
      'UPDATE newsletters SET status = ?, sentAt = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('sent', id).run();

    const successCount = results.filter((r: any) => r.success).length;

    return new Response(JSON.stringify({ 
      success: true, 
      newsletter: { ...newsletter, status: 'sent' },
      recipientCount: subscribers?.length || 0,
      successCount: successCount
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to send newsletter: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Delete newsletter
router.delete('/make-server-53bed28f/newsletters/:id', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = req.params;
    await env.DB.prepare('DELETE FROM newsletters WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete newsletter' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Send direct email
router.post('/make-server-53bed28f/send-email', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { recipients, subject, content } = await req.json();
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'Recipients array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    for (let i = 0; i < recipients.length; i++) {
      const email = recipients[i];
      try {
        const result = await sendEmailViaResend(
          env,
          email,
          subject,
          getEmailTemplate(subject, content, 'email')
        );
        console.log(`✅ Email sent to ${email}:`, result.id);
        results.push({ email, success: true, id: result.id });
      } catch (err: any) {
        console.error(`❌ Error sending to ${email}:`, err.message);
        results.push({ email, success: false, error: err.message });
      }
      
      // Rate limiting: 500ms delay between sends
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter((r: any) => r.success).length;

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email sent to ${successCount} out of ${recipients.length} recipients`,
      recipientCount: recipients.length,
      successCount: successCount,
      results: results
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to send email: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// ============= ADMIN AUTHENTICATION ENDPOINTS =============

// Admin Login
router.post('/api/admin/login', async (req, env: Env) => {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT id, email, password, name, username FROM admins WHERE email = ?'
    ).bind(email).all();

    const admin = results?.[0];
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const passwordValid = await verifyPassword(password, admin.password);
    if (!passwordValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accessToken = jwt.sign(
      { email, id: admin.id, type: 'access' },
      env.JWT_SECRET,
      { expiresIn: '15m', algorithm: 'HS256' }
    );

    const refreshToken = jwt.sign(
      { email, id: admin.id, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    const tokenId = crypto.randomBytes(32).toString('hex');
    await env.DB.prepare(
      'INSERT INTO refresh_tokens (id, admin_id, token, expires_at) VALUES (?, ?, ?, datetime("now", "+7 days"))'
    ).bind(tokenId, admin.id, refreshToken).run();

    return new Response(JSON.stringify({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 900,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        username: admin.username,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Forgot Password
router.post('/api/admin/forgot-password', async (req, env: Env) => {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT id FROM admins WHERE email = ?'
    ).bind(email).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    await env.DB.prepare(
      'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)'
    ).bind(email, resetToken, expiresAt).run();

    console.log(`Password reset token for ${email}: ${resetToken}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return new Response(JSON.stringify({ error: 'Request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Reset Password
router.post('/api/admin/reset-password', async (req, env: Env) => {
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return new Response(JSON.stringify({ error: 'Token and new password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return new Response(JSON.stringify({ 
        error: 'Password does not meet requirements', 
        details: validation.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT email FROM password_reset_tokens WHERE token = ? AND expires_at > datetime("now")'
    ).bind(token).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or expired reset token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resetRecord = results[0];
    const hashedPassword = await hashPassword(newPassword);

    await env.DB.prepare(
      'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
    ).bind(hashedPassword, resetRecord.email).run();

    await env.DB.prepare(
      'DELETE FROM refresh_tokens WHERE admin_id = (SELECT id FROM admins WHERE email = ?)'
    ).bind(resetRecord.email).run();

    await env.DB.prepare(
      'DELETE FROM password_reset_tokens WHERE token = ?'
    ).bind(token).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password reset successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return new Response(JSON.stringify({ error: 'Reset failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Change Password
router.post('/api/admin/change-password', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Current and new password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return new Response(JSON.stringify({ 
        error: 'New password does not meet requirements', 
        details: validation.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT password FROM admins WHERE id = ?'
    ).bind(decoded.id).all();

    const admin = results?.[0];
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Admin not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const passwordValid = await verifyPassword(currentPassword, admin.password);
    if (!passwordValid) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await env.DB.prepare(
      'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(hashedPassword, decoded.id).run();

    await env.DB.prepare(
      'DELETE FROM refresh_tokens WHERE admin_id = ?'
    ).bind(decoded.id).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password changed successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Change password error:', err);
    return new Response(JSON.stringify({ error: 'Change password failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get Admin Profile
router.get('/api/admin/profile', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT id, email, name, username, created_at FROM admins WHERE id = ?'
    ).bind(decoded.id).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Admin not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      admin: results[0] 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Update Admin Profile
router.put('/api/admin/profile', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email, username, name } = await req.json();

    if (username) {
      const { results } = await env.DB.prepare(
        'SELECT * FROM admins WHERE username = ? AND id != ?'
      ).bind(username, decoded.id).all();

      if (results && results.length > 0) {
        return new Response(JSON.stringify({ error: 'Username already taken' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
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

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(decoded.id);

    await env.DB.prepare(
      `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Profile updated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return new Response(JSON.stringify({ error: 'Update failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Refresh Token
router.post('/api/admin/refresh', async (req, env: Env) => {
  try {
    const { refreshToken } = await req.json();
    
    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'Refresh token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid refresh token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (decoded.type !== 'refresh') {
      return new Response(JSON.stringify({ error: 'Invalid token type' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM refresh_tokens WHERE token = ? AND admin_id = ? AND expires_at > datetime("now")'
    ).bind(refreshToken, decoded.id).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Refresh token expired or revoked' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email, id: decoded.id, type: 'access' },
      env.JWT_SECRET,
      { expiresIn: '15m', algorithm: 'HS256' }
    );

    return new Response(JSON.stringify({
      success: true,
      accessToken: newAccessToken,
      expiresIn: 900,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Refresh error:', err);
    return new Response(JSON.stringify({ error: 'Token refresh failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Logout
router.post('/api/admin/logout', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      'DELETE FROM refresh_tokens WHERE admin_id = ?'
    ).bind(decoded.id).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Logged out successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Logout error:', err);
    return new Response(JSON.stringify({ error: 'Logout failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const parts = hash.split('$');
    if (parts.length < 3) {
      // Old format: just iterations + salt + hash
      const [iterations, salt, storedHash] = hash.split('').slice(0, 3);
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
    }
    
    // New format: pbkdf2$iterations$salt$hash
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

// 404 handler - must be last
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
});

export default router;
