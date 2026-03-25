import { createClient } from '@libsql/client';
import crypto from 'crypto';

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

await db.execute('DELETE FROM password_reset_tokens WHERE email = ?', ['muaddhalsway@gmail.com']);

const token = crypto.randomBytes(32).toString('hex');
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  .toISOString().replace('T', ' ').replace('Z', '').split('.')[0];

await db.execute(
  'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
  ['muaddhalsway@gmail.com', token, expiresAt]
);

console.log('✅ Fresh token inserted, valid 24 hours');
console.log('\nReset URL:');
console.log(`https://main.author-fatima-76r-eis.pages.dev/reset-password?token=${token}`);
