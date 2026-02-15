import crypto from 'crypto';
import Database from 'better-sqlite3';

// Create/open database
const db = new Database('admin.db');

// Hash password function (PBKDF2)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$100000$${salt}$${hash}`;
}

// Update admin account
const email = 'muaddhalsway@gmail.com';
const password = 'SecurePass123!'; // Must meet requirements
const name = 'Admin';

try {
  const hashedPassword = hashPassword(password);
  
  // Update existing admin
  const result = db.prepare(
    'UPDATE admins SET email = ?, password = ?, name = ? WHERE id = 1'
  ).run(email, hashedPassword, name);
  
  console.log('✅ Admin account updated successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Name: ${name}`);
  console.log(`\nYou can now login with these credentials.`);
} catch (err) {
  console.error('❌ Error updating admin:', err.message);
}

db.close();
