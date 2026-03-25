import { createClient } from '@libsql/client';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);
const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

async function makePbkdf2(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await pbkdf2(password, salt, 100000, 32, 'sha256');
  return `pbkdf2:${salt}:${hash.toString('base64')}`;
}

const accounts = [
  { email: 'muaddhalsway@gmail.com', password: 'Admin123456!' },
  { email: 'authorfsk@gmail.com', password: 'Admin123456!' },
];

for (const { email, password } of accounts) {
  const hash = await makePbkdf2(password);
  const result = await db.execute(
    "UPDATE admins SET password = ? WHERE email = ?",
    [hash, email]
  );
  console.log(`✅ ${email} → updated (rows affected: ${result.rowsAffected})`);
  console.log(`   Hash: ${hash.substring(0, 40)}...`);
}

// Verify
const check = await db.execute('SELECT email, substr(password,1,10) as pw_start FROM admins');
console.log('\nVerification:', check.rows);
