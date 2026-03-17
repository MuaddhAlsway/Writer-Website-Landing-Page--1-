#!/usr/bin/env node

/**
 * Email System Test Script
 * 
 * Tests the complete email delivery system:
 * 1. Backend server health
 * 2. Gmail SMTP connection
 * 3. Single email sending
 * 4. Multiple email sending
 * 5. Error handling
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const TEST_EMAIL = 'muaddhalsway@gmail.com';

console.log('\n' + '='.repeat(70));
console.log('📧 EMAIL SYSTEM TEST SUITE');
console.log('='.repeat(70));
console.log(`Backend URL: ${BACKEND_URL}\n`);

let testsPassed = 0;
let testsFailed = 0;

// Helper function to make requests
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const body = await response.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      data = body;
    }

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('Test 1: Health Check');
  const result = await request('/health');

  if (result.ok && result.data.status === 'ok') {
    console.log('✅ PASS - Backend server is running\n');
    testsPassed++;
  } else {
    console.log('❌ FAIL - Backend server not responding');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${result.error || 'Unknown error'}\n`);
    testsFailed++;
  }
}

// Test 2: Verify Gmail Connection
async function testGmailConnection() {
  console.log('Test 2: Gmail SMTP Connection');
  const result = await request('/verify-connection');

  if (result.ok && result.data.success) {
    console.log('✅ PASS - Gmail SMTP connection successful');
    console.log(`   Email: ${result.data.email}\n`);
    testsPassed++;
  } else {
    console.log('❌ FAIL - Gmail SMTP connection failed');
    console.log(`   Error: ${result.data.error || 'Unknown error'}\n`);
    testsFailed++;
  }
}

// Test 3: Send Single Email
async function testSingleEmail() {
  console.log('Test 3: Send Single Email');
  const result = await request('/make-server-53bed28f/send-email', {
    method: 'POST',
    body: JSON.stringify({
      recipients: [TEST_EMAIL],
      subject: 'Test Email - Single Recipient',
      content: '<p>This is a test email from the email system.</p>',
      language: 'en',
    }),
  });

  if (result.ok && result.data.success) {
    console.log('✅ PASS - Single email sent successfully');
    console.log(`   Recipient: ${TEST_EMAIL}`);
    console.log(`   Sent: ${result.data.recipientCount}/${result.data.totalRecipients}\n`);
    testsPassed++;
  } else {
    console.log('❌ FAIL - Failed to send single email');
    console.log(`   Error: ${result.data.error || 'Unknown error'}\n`);
    testsFailed++;
  }
}

// Test 4: Send Multiple Emails
async function testMultipleEmails() {
  console.log('Test 4: Send Multiple Emails');
  const recipients = [
    TEST_EMAIL,
    'test1@example.com',
    'test2@example.com',
  ];

  const result = await request('/make-server-53bed28f/send-email', {
    method: 'POST',
    body: JSON.stringify({
      recipients,
      subject: 'Test Email - Multiple Recipients',
      content: '<p>This is a test email sent to multiple recipients.</p>',
      language: 'en',
    }),
  });

  if (result.ok && result.data.success) {
    console.log('✅ PASS - Multiple emails sent successfully');
    console.log(`   Recipients: ${recipients.length}`);
    console.log(`   Sent: ${result.data.recipientCount}/${result.data.totalRecipients}`);
    if (result.data.results) {
      result.data.results.forEach(r => {
        const status = r.success ? '✅' : '❌';
        console.log(`   ${status} ${r.email}`);
      });
    }
    console.log('');
    testsPassed++;
  } else {
    console.log('❌ FAIL - Failed to send multiple emails');
    console.log(`   Error: ${result.data.error || 'Unknown error'}\n`);
    testsFailed++;
  }
}

// Test 5: Invalid Recipients
async function testInvalidRecipients() {
  console.log('Test 5: Invalid Recipients (Error Handling)');
  const result = await request('/make-server-53bed28f/send-email', {
    method: 'POST',
    body: JSON.stringify({
      recipients: [],
      subject: 'Test',
      content: 'Test',
    }),
  });

  if (!result.ok && result.status === 400) {
    console.log('✅ PASS - Correctly rejected empty recipients');
    console.log(`   Error: ${result.data.error}\n`);
    testsPassed++;
  } else {
    console.log('❌ FAIL - Should reject empty recipients');
    console.log(`   Status: ${result.status}\n`);
    testsFailed++;
  }
}

// Test 6: Missing Subject
async function testMissingSubject() {
  console.log('Test 6: Missing Subject (Error Handling)');
  const result = await request('/make-server-53bed28f/send-email', {
    method: 'POST',
    body: JSON.stringify({
      recipients: [TEST_EMAIL],
      content: 'Test content',
    }),
  });

  if (!result.ok && result.status === 400) {
    console.log('✅ PASS - Correctly rejected missing subject');
    console.log(`   Error: ${result.data.error}\n`);
    testsPassed++;
  } else {
    console.log('❌ FAIL - Should reject missing subject');
    console.log(`   Status: ${result.status}\n`);
    testsFailed++;
  }
}

// Run all tests
async function runTests() {
  try {
    await testHealthCheck();
    await testGmailConnection();
    await testSingleEmail();
    await testMultipleEmails();
    await testInvalidRecipients();
    await testMissingSubject();

    // Summary
    console.log('='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    console.log(`Total:  ${testsPassed + testsFailed}`);
    console.log(`Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
    console.log('='.repeat(70) + '\n');

    if (testsFailed === 0) {
      console.log('✅ All tests passed! Email system is working correctly.\n');
      process.exit(0);
    } else {
      console.log('❌ Some tests failed. Please check the errors above.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test suite error:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
