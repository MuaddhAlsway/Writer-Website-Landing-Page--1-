import { createClient } from '@libsql/client';
import crypto from 'crypto';

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA'
});

// Check DB time
const r = await db.execute("SELECT datetime('now') as now");
console.log('DB now:', r.rows[0].now);

// Insert a test token with same format as forgot-password.js
const token = crypto.randomBytes(8).toString('hex');
const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  .toISOString()
  .replace('T', ' ')
  .replace('Z', '')
  .split('.')[0];

console.log('expires_at stored:', expiresAt);

await db.execute('DELETE FROM password_reset_tokens WHERE email = ?', ['test@test.com']);
await db.execute(
  'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
  ['test@test.com', token, expiresAt]
);

// Now query it like reset-password.js does
const result = await db.execute(
  "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')",
  [token]
);
console.log('token found:', result.rows.length > 0 ? 'YES' : 'NO - TOKEN EXPIRED IMMEDIATELY');

// Cleanup
await db.execute('DELETE FROM password_reset_tokens WHERE email = ?', ['test@test.com']);
process.exit(0);
