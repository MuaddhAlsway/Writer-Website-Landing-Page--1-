import { createClient } from '@libsql/client';
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

// Add AuthorFSK account (use same password as muaddhalsway for now)
const password = 'Admin123456!';
const hash = await toPbkdf2(password);

await db.execute(
  `INSERT OR REPLACE INTO admins (email, password, name, username) VALUES (?, ?, ?, ?)`,
  ['authorfsk@gmail.com', hash, 'Author FSK', 'authorfsk']
);

// Remove the generic admin@example.com account
await db.execute(`DELETE FROM admins WHERE email = 'admin@example.com'`);

const admins = await db.execute('SELECT id, email, name FROM admins');
console.log('✅ Admins in DB:', admins.rows);
console.log('\nAuthorized accounts:');
console.log('  muaddhalsway@gmail.com / Admin123456!');
console.log('  authorfsk@gmail.com    / Admin123456!');
