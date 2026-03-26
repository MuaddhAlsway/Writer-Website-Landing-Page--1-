import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

// Simulate reset-password.js hashPassword()
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await pbkdf2(password, salt, 100000, 32, 'sha256');
  return `pbkdf2:${salt}:${hash.toString('base64')}`;
}

// Simulate admin-login.js verifyPassword() - current code
async function verifyPassword(password, storedHash) {
  if (storedHash.startsWith('pbkdf2:')) {
    const parts = storedHash.split(':');
    const salt = parts[1];
    const hash = parts.slice(2).join(':');
    const result = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, key) => {
        if (err) reject(err);
        else resolve(key.toString('base64'));
      });
    });
    console.log('computed:', result);
    console.log('stored:  ', hash);
    return result === hash;
  }
  return false;
}

const testPassword = 'MyNewPassword123!';
const stored = await hashPassword(testPassword);
console.log('stored hash:', stored);
console.log('parts count:', stored.split(':').length);

const valid = await verifyPassword(testPassword, stored);
console.log('verify result:', valid);
