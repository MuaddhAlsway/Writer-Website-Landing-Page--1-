import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

const result = await db.execute('SELECT email, password FROM admins');
console.log('Admins:');
for (const row of result.rows) {
  console.log(' email:', row.email);
  console.log(' hash:', row.password);
  
  // Test common passwords
  const passwords = ['Admin123456!', 'Admin123!', 'admin123', 'Admin123', 'password'];
  for (const p of passwords) {
    const match = await bcrypt.compare(p, row.password);
    if (match) console.log(' ✅ PASSWORD MATCH:', p);
  }
  console.log('');
}
