import { createClient } from '@libsql/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  CONNECTION DIAGNOSTIC TEST');
console.log('═══════════════════════════════════════════════════════════\n');

// Test Turso Connection
async function testTursoConnection() {
  console.log('🔍 Testing Turso Database Connection...\n');
  
  try {
    const url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    
    if (!url || !token) {
      console.error('❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN in .env');
      return false;
    }
    
    console.log(`   URL: ${url.split('?')[0]}`);
    console.log(`   Token length: ${token.length} chars`);
    console.log(`   Token valid: ${token.startsWith('eyJ') ? 'JWT format ✓' : 'Invalid format ✗'}\n`);
    
    const db = createClient({
      url: url,
      authToken: token,
    });
    
    console.log('   Executing test query: SELECT 1...');
    const result = await db.execute('SELECT 1 as test');
    
    if (result.rows && result.rows.length > 0) {
      console.log('   ✓ Query successful');
      console.log(`   Result: ${JSON.stringify(result.rows[0])}\n`);
      
      // Try to get table info
      try {
        const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
        console.log(`   Tables found: ${tables.rows.length}`);
        tables.rows.forEach(t => console.log(`     - ${t.name}`));
      } catch (e) {
        console.log('   (Could not list tables)');
      }
      
      console.log('\n✅ Turso connection: SUCCESS\n');
      return true;
    }
  } catch (err) {
    console.error(`\n❌ Turso connection: FAILED`);
    console.error(`   Error: ${err.message}`);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.error('   → Network connection refused (firewall/proxy issue?)');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('   → DNS resolution failed (check URL)');
    } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      console.error('   → Authentication failed (check token)');
    } else if (err.message.includes('404')) {
      console.error('   → Database not found (check URL)');
    }
    console.log();
    return false;
  }
}

// Test Gmail Connection
async function testGmailConnection() {
  console.log('🔍 Testing Gmail SMTP Connection...\n');
  
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPass) {
      console.error('❌ Missing EMAIL_USER or EMAIL_PASSWORD in .env');
      return false;
    }
    
    console.log(`   Email: ${emailUser}`);
    console.log(`   Password length: ${emailPass.length} chars`);
    console.log(`   Password type: ${emailPass.includes(' ') ? 'App Password' : 'Regular Password'}\n`);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });
    
    console.log('   Verifying SMTP connection...');
    
    const verified = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.error('   ⏱ Connection timeout (5s)');
        resolve(false);
      }, 5000);
      
      transporter.verify((error, success) => {
        clearTimeout(timeout);
        if (error) {
          console.error(`   ✗ Verification failed: ${error.message}`);
          resolve(false);
        } else {
          console.log('   ✓ SMTP connection verified');
          resolve(true);
        }
      });
    });
    
    if (verified) {
      console.log('\n✅ Gmail connection: SUCCESS\n');
      return true;
    } else {
      console.log('\n❌ Gmail connection: FAILED\n');
      console.error('   Possible causes:');
      console.error('   - Invalid app password (generate new one at myaccount.google.com/apppasswords)');
      console.error('   - 2FA not enabled (required for app passwords)');
      console.error('   - Network/firewall blocking SMTP port 587');
      console.error('   - Email account locked or suspended\n');
      return false;
    }
  } catch (err) {
    console.error(`\n❌ Gmail connection: FAILED`);
    console.error(`   Error: ${err.message}\n`);
    return false;
  }
}

// Run tests
async function runTests() {
  const tursoOk = await testTursoConnection();
  const gmailOk = await testGmailConnection();
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`  Turso Database: ${tursoOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`  Gmail SMTP:     ${gmailOk ? '✅ OK' : '❌ FAILED'}\n`);
  
  if (!tursoOk || !gmailOk) {
    console.log('⚠️  Fix the issues above before starting the server.\n');
    process.exit(1);
  } else {
    console.log('✅ All connections working! Ready to start server.\n');
    process.exit(0);
  }
}

runTests();
