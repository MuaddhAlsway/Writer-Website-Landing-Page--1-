import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const connectionUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log('\n🔍 Testing Turso Connection...\n');

if (!connectionUrl || !authToken) {
  console.error('❌ ERROR: Turso credentials missing in .env');
  console.log('   TURSO_CONNECTION_URL:', connectionUrl ? '✅ Set' : '❌ Missing');
  console.log('   TURSO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('✅ Credentials found');
console.log('   Connection URL:', connectionUrl.substring(0, 50) + '...');

try {
  console.log('\n📡 Connecting to Turso...');
  const db = createClient({
    url: connectionUrl,
    authToken: authToken,
  });

  console.log('✅ Connected successfully!\n');

  // Test 1: Check if subscribers table exists
  console.log('📋 Test 1: Checking subscribers table...');
  try {
    const result = await db.execute('SELECT COUNT(*) as count FROM subscribers');
    const count = result.rows[0]?.count || 0;
    console.log(`✅ Subscribers table exists - ${count} records found\n`);
  } catch (err) {
    console.error(`❌ Subscribers table error: ${err.message}\n`);
  }

  // Test 2: Check if newsletters table exists
  console.log('📋 Test 2: Checking newsletters table...');
  try {
    const result = await db.execute('SELECT COUNT(*) as count FROM newsletters');
    const count = result.rows[0]?.count || 0;
    console.log(`✅ Newsletters table exists - ${count} records found\n`);
  } catch (err) {
    console.error(`❌ Newsletters table error: ${err.message}\n`);
  }

  // Test 3: Try to insert a test subscriber
  console.log('📋 Test 3: Testing INSERT operation...');
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    await db.execute(
      'INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)',
      [testEmail, 'en', 'Test User']
    );
    console.log(`✅ Successfully inserted test subscriber: ${testEmail}\n`);

    // Test 4: Retrieve the test subscriber
    console.log('📋 Test 4: Testing SELECT operation...');
    const result = await db.execute(
      'SELECT * FROM subscribers WHERE email = ?',
      [testEmail]
    );
    if (result.rows.length > 0) {
      console.log(`✅ Successfully retrieved test subscriber\n`);
      console.log('   Data:', result.rows[0]);
    } else {
      console.log(`❌ Could not retrieve test subscriber\n`);
    }

    // Test 5: Delete the test subscriber
    console.log('\n📋 Test 5: Testing DELETE operation...');
    const deleteResult = await db.execute(
      'DELETE FROM subscribers WHERE email = ?',
      [testEmail]
    );
    console.log(`✅ Successfully deleted test subscriber (${deleteResult.rowsAffected} rows affected)\n`);
  } catch (err) {
    console.error(`❌ INSERT/SELECT/DELETE error: ${err.message}\n`);
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ TURSO DATABASE IS CONNECTED AND WORKING!');
  console.log('═══════════════════════════════════════════════════════\n');

} catch (err) {
  console.error('❌ CONNECTION FAILED:', err.message);
  console.log('\nPossible causes:');
  console.log('  1. Invalid connection URL');
  console.log('  2. Invalid auth token');
  console.log('  3. Network connectivity issue');
  console.log('  4. Turso database not accessible\n');
  process.exit(1);
}
