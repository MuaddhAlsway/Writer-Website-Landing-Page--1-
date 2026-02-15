import Database from 'better-sqlite3';

const db = new Database('admin.db');

try {
  // Get table info
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);
  
  // Get admins table schema
  const schema = db.prepare("PRAGMA table_info(admins)").all();
  console.log('\nAdmins table schema:');
  schema.forEach(col => {
    console.log(`  - ${col.name}: ${col.type}`);
  });
  
  // Get existing admins
  const admins = db.prepare('SELECT * FROM admins').all();
  console.log('\nExisting admins:');
  admins.forEach(admin => {
    console.log(`  - ${admin.email}`);
  });
} catch (err) {
  console.error('Error:', err.message);
}

db.close();
