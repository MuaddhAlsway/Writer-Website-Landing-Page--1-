import { Router } from 'itty-router';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const authRouter = Router();

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ADMIN_RATE_LIMIT_STORE?: KVNamespace;
}

interface JWTPayload {
  email: string;
  adminId: string;
  type: 'access' | 'refresh';
}

// ============= SECURITY UTILITIES =============

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 12) errors.push('Password must be at least 12 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
  if (!/[0-9]/.test(password)) errors.push('Password must contain numbers');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain special characters');
  }
  
  return { valid: errors.length === 0, errors };
}

// PBKDF2 password hashing (Cloudflare Workers compatible)
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$100000$${salt}$${hash}`;
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
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

// Generate secure random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate access token (15 minutes)
export function generateAccessToken(email: string, adminId: string, secret: string): string {
  return jwt.sign(
    { email, adminId, type: 'access' },
    secret,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}

// Generate refresh token (7 days)
export function generateRefreshToken(email: string, adminId: string, secret: string): string {
  return jwt.sign(
    { email, adminId, type: 'refresh' },
    secret,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

// Verify JWT token
export function verifyToken(token: string, secret: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as JWTPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

// Rate limiting (in-memory for single instance, use KV for distributed)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 900000 // 15 minutes
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  if (attempt.count >= maxAttempts) {
    const retryAfter = Math.ceil((attempt.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }
  
  attempt.count++;
  return { allowed: true, remaining: maxAttempts - attempt.count };
}

// Security headers
export function getSecurityHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

// ============= AUTH ENDPOINTS =============

// Admin Login
authRouter.post('/api/admin/login', async (req, env: Env) => {
  try {
    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Rate limiting
    const rateLimit = checkRateLimit(email);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        }),
        {
          status: 429,
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': rateLimit.retryAfter?.toString() || '900',
          },
        }
      );
    }
    
    // Find admin
    const { results } = await env.DB.prepare(
      'SELECT id, email, password, name, username FROM admins WHERE email = ?'
    ).bind(email).all();
    
    const admin = results?.[0];
    if (!admin) {
      // Don't reveal if email exists (timing attack prevention)
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Verify password
    const passwordValid = await verifyPassword(password, admin.password);
    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(email, admin.id, env.JWT_SECRET);
    const refreshToken = generateRefreshToken(email, admin.id, env.JWT_REFRESH_SECRET);
    
    // Store refresh token in database
    const tokenId = generateToken();
    await env.DB.prepare(
      'INSERT INTO refresh_tokens (id, admin_id, token, expires_at) VALUES (?, ?, ?, datetime("now", "+7 days"))'
    ).bind(tokenId, admin.id, refreshToken).run();
    
    // Return tokens (refresh token as HTTP-only cookie in production)
    return new Response(
      JSON.stringify({
        success: true,
        accessToken,
        refreshToken,
        expiresIn: 900, // 15 minutes in seconds
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          username: admin.username,
        },
      }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Login error:', err);
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

// Refresh Access Token
authRouter.post('/api/admin/refresh', async (req, env: Env) => {
  try {
    const { refreshToken } = await req.json();
    
    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: 'Refresh token required' }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Verify refresh token
    const decoded = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
    if (!decoded || decoded.type !== 'refresh') {
      return new Response(
        JSON.stringify({ error: 'Invalid refresh token' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Check if token exists in database
    const { results } = await env.DB.prepare(
      'SELECT * FROM refresh_tokens WHERE token = ? AND admin_id = ? AND expires_at > datetime("now")'
    ).bind(refreshToken, decoded.adminId).all();
    
    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Refresh token expired or revoked' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.email, decoded.adminId, env.JWT_SECRET);
    
    return new Response(
      JSON.stringify({
        success: true,
        accessToken: newAccessToken,
        expiresIn: 900,
      }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Refresh error:', err);
    return new Response(
      JSON.stringify({ error: 'Token refresh failed' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

// Logout (revoke refresh token)
authRouter.post('/api/admin/logout', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    const decoded = verifyToken(token, env.JWT_SECRET);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Revoke all refresh tokens for this admin
    await env.DB.prepare(
      'DELETE FROM refresh_tokens WHERE admin_id = ?'
    ).bind(decoded.adminId).run();
    
    return new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Logout error:', err);
    return new Response(
      JSON.stringify({ error: 'Logout failed' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

// Request Password Reset
authRouter.post('/api/admin/forgot-password', async (req, env: Env) => {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email required' }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Rate limiting for password reset
    const rateLimit = checkRateLimit(`reset:${email}`, 3, 3600000); // 3 attempts per hour
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many reset requests. Please try again later.' }),
        { status: 429, headers: getSecurityHeaders() }
      );
    }
    
    const { results } = await env.DB.prepare(
      'SELECT id FROM admins WHERE email = ?'
    ).bind(email).all();
    
    // Always return success to prevent email enumeration
    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'If an account exists, a reset link has been sent',
        }),
        { status: 200, headers: getSecurityHeaders() }
      );
    }
    
    const resetToken = generateToken();
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour
    
    await env.DB.prepare(
      'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)'
    ).bind(email, resetToken, expiresAt).run();
    
    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return new Response(
      JSON.stringify({ error: 'Request failed' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

// Reset Password
authRouter.post('/api/admin/reset-password', async (req, env: Env) => {
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Token and new password required' }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Validate password strength
    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Password does not meet requirements', details: validation.errors }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Find valid reset token
    const { results } = await env.DB.prepare(
      'SELECT email FROM password_reset_tokens WHERE token = ? AND expires_at > datetime("now")'
    ).bind(token).all();
    
    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired reset token' }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    const resetRecord = results[0];
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password and revoke all refresh tokens
    await env.DB.prepare(
      'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
    ).bind(hashedPassword, resetRecord.email).run();
    
    await env.DB.prepare(
      'DELETE FROM refresh_tokens WHERE admin_id = (SELECT id FROM admins WHERE email = ?)'
    ).bind(resetRecord.email).run();
    
    // Delete used reset token
    await env.DB.prepare(
      'DELETE FROM password_reset_tokens WHERE token = ?'
    ).bind(token).run();
    
    return new Response(
      JSON.stringify({ success: true, message: 'Password reset successfully' }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Reset password error:', err);
    return new Response(
      JSON.stringify({ error: 'Reset failed' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

// Change Password (authenticated)
authRouter.post('/api/admin/change-password', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    const decoded = verifyToken(token, env.JWT_SECRET);
    if (!decoded || decoded.type !== 'access') {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Current and new password required' }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Validate new password strength
    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'New password does not meet requirements', details: validation.errors }),
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // Verify current password
    const { results } = await env.DB.prepare(
      'SELECT password FROM admins WHERE id = ?'
    ).bind(decoded.adminId).all();
    
    const admin = results?.[0];
    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Admin not found' }),
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    const passwordValid = await verifyPassword(currentPassword, admin.password);
    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: 'Current password is incorrect' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Update password
    const hashedPassword = await hashPassword(newPassword);
    await env.DB.prepare(
      'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(hashedPassword, decoded.adminId).run();
    
    // Revoke all refresh tokens (force re-login)
    await env.DB.prepare(
      'DELETE FROM refresh_tokens WHERE admin_id = ?'
    ).bind(decoded.adminId).run();
    
    return new Response(
      JSON.stringify({ success: true, message: 'Password changed successfully' }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Change password error:', err);
    return new Response(
      JSON.stringify({ error: 'Change password failed' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

// Get Admin Profile (authenticated)
authRouter.get('/api/admin/profile', async (req, env: Env) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    const decoded = verifyToken(token, env.JWT_SECRET);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    const { results } = await env.DB.prepare(
      'SELECT id, email, name, username, created_at FROM admins WHERE id = ?'
    ).bind(decoded.adminId).all();
    
    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Admin not found' }),
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, admin: results[0] }),
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (err: any) {
    console.error('Get profile error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profile' }),
      { status: 500, headers: getSecurityHeaders() }
    );
  }
});

export default authRouter;
