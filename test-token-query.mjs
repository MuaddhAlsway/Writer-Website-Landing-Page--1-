import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
});

const token = 'ef9d5f41513bec1ba4536438379a962c9f4583bfca15676233f2687d3273b086';

// Test 1: exact match no expiry check
const r1 = await db.execute('SELECT * FROM password_reset_tokens WHERE token = ?', [token]);
console.log('Exact match:', r1.rows);

// Test 2: with datetime check
const r2 = await db.execute("SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')", [token]);
console.log('With expiry check:', r2.rows);

// Test 3: check what datetime('now') returns vs expires_at
const r3 = await db.execute("SELECT expires_at, datetime('now') as now, expires_at > datetime('now') as valid FROM password_reset_tokens WHERE token = ?", [token]);
console.log('Comparison:', r3.rows);
