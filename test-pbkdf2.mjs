import { createClient } from '@libsql/client';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

const result = await db.execute("SELECT email, password FROM admins WHERE email = 'muaddhalsway@gmail.com'");
const { email, password: storedHash } = result.rows[0];

console.log('Stored hash:', storedHash);
console.log('Hash format:', storedHash.startsWith('pbkdf2:') ? 'PBKDF2' : storedHash.startsWith('$2') ? 'bcrypt' : 'unknown');

if (storedHash.startsWith('pbkdf2:')) {
  const [, salt, hash] = storedHash.split(':');
  const testPassword = 'Admin123456!';
  
  // Node.js PBKDF2
  const nodeHash = await pbkdf2(testPassword, salt, 100000, 32, 'sha256');
  const nodeB64 = nodeHash.toString('base64');
  console.log('Node hash:   ', nodeB64);
  console.log('Stored hash: ', hash);
  console.log('Node match:  ', nodeB64 === hash);
}
