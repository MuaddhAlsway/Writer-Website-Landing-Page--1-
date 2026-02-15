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

// Create admin account
const email = 'muaddhalsway@gmail.com';
const password = 'SecurePass123!'; // Must meet requirements
const name = 'Admin';
const username = 'admin';

try {
  const hashedPassword = hashPassword(password);
  
  // Delete existing admin if exists
  db.prepare('DELETE FROM admins WHERE email = ?').run(email);
  
  // Insert new admin
  const result = db.prepare(
    'INSERT INTO admins (email, password, name, username) VALUES (?, ?, ?, ?)'
  ).run(email, hashedPassword, name, username);
  
  console.log('✅ Admin account created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Username: ${username}`);
  console.log(`Name: ${name}`);
  console.log(`\nYou can now login with these credentials.`);
} catch (err) {
  console.error('❌ Error creating admin:', err.message);
}

db.close();
