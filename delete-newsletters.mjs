import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'admin.db');

const db = new Database(dbPath);

try {
  db.prepare('DELETE FROM newsletters').run();
  console.log('All newsletters deleted successfully');
} catch (err) {
  console.error('Error deleting newsletters:', err);
} finally {
  db.close();
}
