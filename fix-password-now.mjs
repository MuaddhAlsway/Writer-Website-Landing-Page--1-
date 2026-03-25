import { createClient } from '@libsql/client';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);
const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

// Check all rows first
const all = await db.execute('SELECT id, email, substr(password,1,15) as pw FROM admins');
console.log('All admins:', all.rows);

// Update by ID to be safe
const salt = crypto.randomBytes(16).toString('hex');
const hash = await pbkdf2('Admin2006!', salt, 100000, 32, 'sha256');
const stored = `pbkdf2:${salt}:${hash.toString('base64')}`;

// Update row with id=1
const r1 = await db.execute('UPDATE admins SET password = ? WHERE id = 1', [stored]);
console.log('Updated id=1:', r1.rowsAffected, 'rows');

// Verify
const check = await db.execute('SELECT id, email, substr(password,1,15) as pw FROM admins');
console.log('After update:', check.rows);
