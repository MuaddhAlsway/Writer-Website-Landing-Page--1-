import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

// Hash and update admin@example.com plaintext password
const hashed = await bcrypt.hash('Admin123', 12);
await db.execute(
  "UPDATE admins SET password = ?, updated_at = datetime('now') WHERE email = ?",
  [hashed, 'admin@example.com']
);
console.log('✅ admin@example.com password hashed');

// Verify both accounts
const result = await db.execute('SELECT id, email, name, substr(password,1,7) as pw_prefix FROM admins');
console.log('Admins:', result.rows);
