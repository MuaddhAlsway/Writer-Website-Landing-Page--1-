import crypto from 'crypto';

interface JWTPayload {
  email: string;
  adminId: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
}

// Password validation - enforce strong passwords
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Secure password hashing using PBKDF2
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const saltValue = salt || crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, saltValue, 100000, 64, 'sha512')
    .toString('hex');

  return { hash, salt: saltValue };
}

// Verify password
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt);
  return newHash === hash;
}

// Generate secure JWT tokens
export function generateTokens(
  email: string,
  adminId: string,
  secret: string,
  accessTokenExpiry: number = 900, // 15 minutes
  refreshTokenExpiry: number = 604800 // 7 days
): TokenPair {
  const now = Math.floor(Date.now() / 1000);

  const accessPayload: JWTPayload = {
    email,
    adminId,
    iat: now,
    exp: now + accessTokenExpiry,
    type: 'access',
  };

  const refreshPayload: JWTPayload = {
    email,
    adminId,
    iat: now,
    exp: now + refreshTokenExpiry,
    type: 'refresh',
  };

  const accessToken = createJWT(accessPayload, secret);
  const refreshToken = createJWT(refreshPayload, secret);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiry,
    refreshTokenExpiry,
  };
}

// Create JWT token
function createJWT(payload: JWTPayload, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

// Verify JWT token
export function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    const [header, body, signature] = token.split('.');

    if (!header || !body || !signature) {
      return null;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// Generate secure random token for password reset
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Rate limiting helper
export interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 900000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, remaining: maxAttempts - 1, resetTime: rateLimitStore[key].resetTime };
  }

  const record = rateLimitStore[key];

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: maxAttempts - 1, resetTime: record.resetTime };
  }

  record.count++;

  if (record.count > maxAttempts) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  return { allowed: true, remaining: maxAttempts - record.count, resetTime: record.resetTime };
}

// Clean up expired rate limit entries periodically
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 300000);
