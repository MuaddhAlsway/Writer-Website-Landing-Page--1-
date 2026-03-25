// Simulate exactly what the Cloudflare function does
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2Node = promisify(crypto.pbkdf2);

const password = 'Admin123456!';
const salt = '6fd43547242e1833a23759646026b2b4';
const storedHash = 'nbOcn8aQEhZX0mzH9+QV3YmnWzG+9vzR3QD30iYqNq8=';

// Node.js way (used in migration)
const nodeResult = await pbkdf2Node(password, salt, 100000, 32, 'sha256');
console.log('Node (raw string salt):', nodeResult.toString('base64'));

// Web Crypto way (used in CF function) - uses TextEncoder on salt
const enc = new TextEncoder();
const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits(
  { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
  keyMaterial, 256
);
const webCryptoHash = btoa(String.fromCharCode(...new Uint8Array(bits)));
console.log('WebCrypto (TextEncoder salt):', webCryptoHash);
console.log('Match:', webCryptoHash === storedHash);
