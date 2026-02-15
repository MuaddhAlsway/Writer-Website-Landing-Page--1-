import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT tokens with RS256 (asymmetric)
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || crypto.randomBytes(32).toString('hex');

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12); // 12 rounds for high security
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(adminId, email) {
  return jwt.sign(
    { adminId, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}

export function generateRefreshToken(adminId, email) {
  return jwt.sign(
    { adminId, email, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    return null;
  }
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getSecurityHeaders() {
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

export const JWT_SECRET_KEY = JWT_SECRET;
export const JWT_REFRESH_SECRET_KEY = JWT_REFRESH_SECRET;
