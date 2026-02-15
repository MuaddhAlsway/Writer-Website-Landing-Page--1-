import Database from 'better-sqlite3';
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

const db = new Database('admin.db');
const hashedPassword = hashPassword('Admin123456789!');
db.prepare('UPDATE admins SET password = ? WHERE email = ?').run(hashedPassword, 'muaddhalsway@gmail.com');
console.log('✅ Password updated to: Admin123456789!');
const admin = db.prepare('SELECT email FROM admins WHERE email = ?').get('muaddhalsway@gmail.com');
console.log('Admin email:', admin.email);
