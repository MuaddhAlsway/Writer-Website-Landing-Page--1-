import { Router } from 'itty-router';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = Router();

interface Env {
  DB: D1Database;
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
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Password must contain special character');
  
  return { valid: errors.length === 0, errors };
}

// Hash password
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$100000$${salt}$${hash}`;
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const parts = hash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
    
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

// ============= ADMIN AUTHENTICATION ENDPOINTS =============

// Admin Login
router.post('/admin/login', async (req, env: Env) => {
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
router.post('/admin/forgot-password', async (req, env: Env) => {
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
router.post('/admin/reset-password', async (req, env: Env) => {
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
router.post('/admin/change-password', async (req, env: Env) => {
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
router.get('/admin/profile', async (req, env: Env) => {
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
router.put('/admin/profile', async (req, env: Env) => {
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
router.post('/admin/refresh', async (req, env: Env) => {
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
router.post('/admin/logout', async (req, env: Env) => {
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

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
});

export const onRequest: PagesFunction = (context) => router.handle(context.request, context.env);
