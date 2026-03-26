import crypto from 'crypto';
import { promisify } from 'util';
import { createClient } from '@libsql/client';

const pbkdf2 = promisify(crypto.pbkdf2);

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA'
});

// Step 1: Simulate reset-password.js saving a new password
const newPassword = 'TestNewPass99!';
const salt = crypto.randomBytes(16).toString('hex');
const hash = await pbkdf2(newPassword, salt, 100000, 32, 'sha256');
const stored = `pbkdf2:${salt}:${hash.toString('base64')}`;

await db.execute(
  "UPDATE admins SET password = ? WHERE email = ?",
  [stored, 'authorfsk@gmail.com']
);
console.log('Saved hash:', stored);

// Step 2: Simulate admin-login.js verifying it
const row = await db.execute('SELECT password FROM admins WHERE email = ?', ['authorfsk@gmail.com']);
const storedHash = row.rows[0].password;
console.log('Read back:', storedHash);
console.log('Match:', stored === storedHash);

// Step 3: Verify with login logic
const parts = storedHash.split(':');
const s = parts[1];
const h = parts.slice(2).join(':');
const computed = await pbkdf2(newPassword, s, 100000, 32, 'sha256');
console.log('Verify result:', computed.toString('base64') === h);

// Restore original password
const salt2 = crypto.randomBytes(16).toString('hex');
const hash2 = await pbkdf2('Admin123456!', salt2, 100000, 32, 'sha256');
const stored2 = `pbkdf2:${salt2}:${hash2.toString('base64')}`;
await db.execute("UPDATE admins SET password = ? WHERE email = ?", [stored2, 'authorfsk@gmail.com']);
await db.execute("UPDATE admins SET password = ? WHERE email = ?", [stored2, 'muaddhalsway@gmail.com']);
console.log('Restored both to Admin123456!');
process.exit(0);
