import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'admin.db');

const db = new Database(dbPath);

try {
  // Delete all newsletters
  const deleteStmt = db.prepare('DELETE FROM newsletters');
  const result = deleteStmt.run();
  
  console.log(`✅ Deleted ${result.changes} newsletters`);
  
  // Verify
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM newsletters');
  const count = countStmt.get().count;
  
  console.log(`✅ Remaining newsletters: ${count}`);
  console.log('✅ Newsletter database cleared successfully!');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  db.close();
}
