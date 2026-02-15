import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  PASSWORD RESET TOKEN DEBUG');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // 1. Check existing tokens
    console.log('📋 Existing tokens in database:\n');
    const existingTokens = await db.execute('SELECT email, token, expires_at FROM password_reset_tokens');
    
    if (existingTokens.rows && existingTokens.rows.length > 0) {
      existingTokens.rows.forEach((row, i) => {
        const expiresAt = parseInt(row.expires_at);
        const expiresDate = new Date(expiresAt).toISOString();
        const isExpired = expiresAt < Date.now();
        console.log(`${i + 1}. Email: ${row.email}`);
        console.log(`   Token: ${row.token.substring(0, 20)}...`);
        console.log(`   Expires at: ${expiresDate}`);
        console.log(`   Status: ${isExpired ? '❌ EXPIRED' : '✓ VALID'}`);
        console.log(`   Expires in: ${Math.round((expiresAt - Date.now()) / 1000)} seconds\n`);
      });
    } else {
      console.log('No tokens found.\n');
    }

    // 2. Create a test token
    console.log('🔧 Creating test token...\n');
    const testEmail = 'test@example.com';
    const testToken = crypto.randomBytes(32).toString('hex');
    const expiresAtMs = Date.now() + 3600000; // 1 hour

    console.log(`Email: ${testEmail}`);
    console.log(`Token: ${testToken}`);
    console.log(`Expires at: ${new Date(expiresAtMs).toISOString()}`);
    console.log(`Expires in: 3600 seconds\n`);

    // 3. Test the comparison logic
    console.log('🧪 Testing token comparison logic:\n');
    
    const now = Date.now();
    console.log(`Current time: ${now}`);
    console.log(`Expires at: ${expiresAtMs}`);
    console.log(`Comparison: ${expiresAtMs} > ${now} = ${expiresAtMs > now}\n`);

    // 4. Test with database
    console.log('💾 Testing with database:\n');
    
    // Insert test token
    await db.execute({
      sql: 'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
      args: [testEmail, testToken, expiresAtMs.toString()],
    });
    console.log('✓ Test token inserted\n');

    // Try to retrieve it
    const result = await db.execute({
      sql: 'SELECT email, expires_at FROM password_reset_tokens WHERE token = ? AND CAST(expires_at AS INTEGER) > ?',
      args: [testToken, now.toString()],
    });

    if (result.rows && result.rows.length > 0) {
      console.log('✓ Token retrieved successfully');
      console.log(`  Email: ${result.rows[0].email}`);
      console.log(`  Expires at: ${result.rows[0].expires_at}\n`);
    } else {
      console.log('❌ Token NOT found\n');
      
      // Debug: check if token exists at all
      const debugResult = await db.execute({
        sql: 'SELECT email, token, expires_at FROM password_reset_tokens WHERE token = ?',
        args: [testToken],
      });
      
      if (debugResult.rows && debugResult.rows.length > 0) {
        console.log('Token exists but comparison failed:');
        const row = debugResult.rows[0];
        const expiresAt = parseInt(row.expires_at);
        console.log(`  Token: ${row.token.substring(0, 20)}...`);
        console.log(`  Expires at (raw): ${row.expires_at}`);
        console.log(`  Expires at (parsed): ${expiresAt}`);
        console.log(`  Current time: ${now}`);
        console.log(`  Is valid: ${expiresAt > now}\n`);
      }
    }

    // 5. Clean up
    console.log('🧹 Cleaning up test token...\n');
    await db.execute({
      sql: 'DELETE FROM password_reset_tokens WHERE token = ?',
      args: [testToken],
    });
    console.log('✓ Test token deleted\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('  DEBUG COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message, '\n');
    process.exit(1);
  }
}

main();
