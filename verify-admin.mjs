import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  ADMIN ACCOUNT VERIFICATION & CREATION');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Check existing admins
    console.log('🔍 Checking existing admin accounts...\n');
    const result = await db.execute('SELECT id, email, username, name FROM admins');
    
    if (result.rows && result.rows.length > 0) {
      console.log('✓ Found existing admin accounts:\n');
      result.rows.forEach((admin, i) => {
        console.log(`  ${i + 1}. Email: ${admin.email}`);
        console.log(`     Username: ${admin.username}`);
        console.log(`     Name: ${admin.name}`);
        console.log(`     ID: ${admin.id}\n`);
      });
    } else {
      console.log('⚠ No admin accounts found.\n');
    }

    // Ask if user wants to create new admin
    const createNew = await question('Create a new admin account? (yes/no): ');
    
    if (createNew.toLowerCase() !== 'yes' && createNew.toLowerCase() !== 'y') {
      console.log('\n✓ Exiting without creating new account.\n');
      rl.close();
      process.exit(0);
    }

    console.log('\n📝 Enter admin account details:\n');
    
    const email = await question('Email: ');
    const password = await question('Password: ');
    const name = await question('Name: ');
    const username = await question('Username: ');

    // Validate inputs
    if (!email || !password || !name || !username) {
      console.error('\n❌ All fields are required.\n');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n❌ Password must be at least 6 characters.\n');
      rl.close();
      process.exit(1);
    }

    // Check if email already exists
    const existingEmail = await db.execute({
      sql: 'SELECT id FROM admins WHERE email = ?',
      args: [email],
    });

    if (existingEmail.rows && existingEmail.rows.length > 0) {
      console.error(`\n❌ Email ${email} already exists.\n`);
      rl.close();
      process.exit(1);
    }

    // Check if username already exists
    const existingUsername = await db.execute({
      sql: 'SELECT id FROM admins WHERE username = ?',
      args: [username],
    });

    if (existingUsername.rows && existingUsername.rows.length > 0) {
      console.error(`\n❌ Username ${username} already exists.\n`);
      rl.close();
      process.exit(1);
    }

    // Create admin account
    console.log('\n⏳ Creating admin account...\n');
    
    await db.execute({
      sql: 'INSERT INTO admins (email, password, name, username) VALUES (?, ?, ?, ?)',
      args: [email, password, name, username],
    });

    console.log('✅ Admin account created successfully!\n');
    console.log('Account Details:');
    console.log(`  Email: ${email}`);
    console.log(`  Username: ${username}`);
    console.log(`  Name: ${name}`);
    console.log(`  Password: ${password}\n`);

    console.log('📝 Next steps:');
    console.log('  1. Start the server: npm run server');
    console.log('  2. Go to http://localhost:5173/admin');
    console.log(`  3. Login with email: ${email}`);
    console.log(`  4. Enter password: ${password}\n`);

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message, '\n');
    rl.close();
    process.exit(1);
  }
}

main();
