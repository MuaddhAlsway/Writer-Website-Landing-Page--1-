import crypto from 'crypto';
import { promisify } from 'util';
import { createClient } from '@libsql/client';

const pbkdf2 = promisify(crypto.pbkdf2);

const password = 'Admin123456!';
const salt = crypto.randomBytes(16).toString('hex');
const hash = await pbkdf2(password, salt, 100000, 32, 'sha256');
const stored = `pbkdf2:${salt}:${hash.toString('base64')}`;

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA'
});

await db.execute('UPDATE admins SET password = ? WHERE email = ?', [stored, 'authorfsk@gmail.com']);
await db.execute('UPDATE admins SET password = ? WHERE email = ?', [stored, 'muaddhalsway@gmail.com']);
console.log('Done. Both accounts reset to: Admin123456!');
