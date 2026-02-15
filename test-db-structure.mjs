import Database from 'better-sqlite3';

const db = new Database('admin.db');

// Check foreign keys
const fks = db.prepare('PRAGMA foreign_key_list(admins)').all();
console.log('Foreign keys referencing admins:');
console.log(JSON.stringify(fks, null, 2));

// Check all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('\nAll tables:', tables.map(t => t.name).join(', '));

// Check password_reset_tokens table structure
const prtInfo = db.prepare('PRAGMA table_info(password_reset_tokens)').all();
console.log('\npassword_reset_tokens columns:');
prtInfo.forEach(col => {
  console.log(`  - ${col.name} (${col.type})`);
});

// Check if there are any password_reset_tokens
const prtCount = db.prepare('SELECT COUNT(*) as count FROM password_reset_tokens').get();
console.log(`\npassword_reset_tokens count: ${prtCount.count}`);

db.close();
