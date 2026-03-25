import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

async function toPbkdf2(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await pbkdf2(password, salt, 100000, 32, 'sha256');
  return `pbkdf2:${salt}:${hash.toString('base64')}`;
}

// Known passwords for each admin
const accounts = [
  { email: 'muaddhalsway@gmail.com', password: 'Admin123456!' },
  { email: 'admin@example.com', password: 'Admin123' },
];

for (const account of accounts) {
  const newHash = await toPbkdf2(account.password);
  await db.execute("UPDATE admins SET password = ? WHERE email = ?", [newHash, account.email]);
  console.log(`✅ Migrated ${account.email} → pbkdf2 hash`);
}

console.log('\nDone. Passwords migrated to PBKDF2 (Web Crypto compatible).');
