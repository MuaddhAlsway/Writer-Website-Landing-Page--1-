import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createAdmin() {
  try {
    // Check if admin exists
    const result = await db.execute({
      sql: 'SELECT id FROM admins WHERE email = ?',
      args: ['admin@example.com'],
    });

    if (result.rows && result.rows.length > 0) {
      console.log('Admin already exists, updating password...');
      await db.execute({
        sql: 'UPDATE admins SET password = ? WHERE email = ?',
        args: ['Admin123', 'admin@example.com'],
      });
      console.log('✓ Admin password updated');
    } else {
      console.log('Creating new admin...');
      await db.execute({
        sql: 'INSERT INTO admins (email, password, name, username) VALUES (?, ?, ?, ?)',
        args: ['admin@example.com', 'Admin123', 'Admin', 'admin'],
      });
      console.log('✓ Admin created successfully');
    }

    // Verify
    const verify = await db.execute({
      sql: 'SELECT email, name FROM admins WHERE email = ?',
      args: ['admin@example.com'],
    });

    if (verify.rows && verify.rows.length > 0) {
      console.log('✓ Admin verified:', verify.rows[0]);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createAdmin();
