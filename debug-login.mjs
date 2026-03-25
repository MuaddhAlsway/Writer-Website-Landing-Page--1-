import { createClient } from '@libsql/client';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);
const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

const r = await db.execute("SELECT password FROM admins WHERE email = 'muaddhalsway@gmail.com'");
const storedHash = String(r.rows[0].password);
console.log('Stored:', storedHash);

const [prefix, salt, hash] = storedHash.split(':');
console.log('Parts:', { prefix, salt: salt?.substring(0,8)+'...', hash: hash?.substring(0,8)+'...' });

const password = 'Admin2006!';

// Node.js PBKDF2 (same as migration script)
const nodeResult = await pbkdf2(password, salt, 100000, 32, 'sha256');
const nodeHash = nodeResult.toString('base64');
console.log('Node computed:', nodeHash.substring(0,20)+'...');
console.log('Stored hash: ', hash?.substring(0,20)+'...');
console.log('Node match:', nodeHash === hash);

// Web Crypto PBKDF2 (same as Cloudflare function)
const enc = new TextEncoder();
const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits(
  { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
  keyMaterial, 256
);
const webHash = btoa(String.fromCharCode(...new Uint8Array(bits)));
console.log('WebCrypto computed:', webHash.substring(0,20)+'...');
console.log('WebCrypto match:', webHash === hash);
