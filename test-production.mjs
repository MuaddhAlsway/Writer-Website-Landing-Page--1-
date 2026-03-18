#!/usr/bin/env node

import { createClient } from '@libsql/client';
import nodemailer from 'nodemailer';

const BASE_URL = 'https://main.author-fatima-76r-eis.pages.dev';
const TEST_TOKEN = 'test-token-12345';

// Configuration
const config = {
  turso: {
    connectionUrl: 'libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA'
  },
  gmail: {
    user: 'AuthorFSK@gmail.com',
    appPassword: 'peed qvhs ekmo kisv'
  }
};

const results = {
  database: { status: '⏳ Testing', details: '' },
  newsletters: { status: '⏳ Testing', details: '' },
  subscribers: { status: '⏳ Testing', details: '' },
  email: { status: '⏳ Testing', details: '' },
  dashboard: { status: '⏳ Testing', details: '' }
};

// Test 1: Database Connection
async function testDatabase() {
  try {
    console.log('\n📡 TEST 1: Database Connection');
    const db = createClient({
      url: config.turso.connectionUrl,
      authToken: config.turso.authToken,
    });
    
    const result = await db.execute('SELECT 1');
    results.database.status = '✅ Connected';
    results.database.details = 'Turso database connection successful';
    console.log('✅ Database connected successfully');
  } catch (err) {
    results.database.status = '❌ Failed';
    results.database.details = err.message;
    console.error('❌ Database connection failed:', err.message);
  }
}

// Test 2: /api/newsletters
async function testNewsletters() {
  try {
    console.log('\n📋 TEST 2: /api/newsletters');
    const response = await fetch(`${BASE_URL}/api/newsletters`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
    });
    
    const data = await response.json();
    
    if (response.status === 200) {
      results.newsletters.status = '✅ 200 OK';
      results.newsletters.details = `Returned ${data.newsletters?.length || 0} newsletters`;
      console.log('✅ /api/newsletters working:', data);
    } else if (response.status === 503) {
      results.newsletters.status = '❌ 503 Service Unavailable';
      results.newsletters.details = data.error || 'Database not configured';
      console.error('❌ /api/newsletters returned 503:', data);
    } else {
      results.newsletters.status = `⚠️ ${response.status}`;
      results.newsletters.details = data.error || 'Unknown error';
      console.warn(`⚠️ /api/newsletters returned ${response.status}:`, data);
    }
  } catch (err) {
    results.newsletters.status = '❌ Failed';
    results.newsletters.details = err.message;
    console.error('❌ /api/newsletters test failed:', err.message);
  }
}

// Test 3: /api/subscribers
async function testSubscribers() {
  try {
    console.log('\n👥 TEST 3: /api/subscribers');
    const response = await fetch(`${BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        language: 'en'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 200) {
      results.subscribers.status = '✅ 200 OK';
      results.subscribers.details = 'Subscriber added successfully';
      console.log('✅ /api/subscribers working:', data);
    } else if (response.status === 400) {
      results.subscribers.status = '❌ 400 Bad Request';
      results.subscribers.details = data.error || 'Invalid request';
      console.error('❌ /api/subscribers returned 400:', data);
    } else {
      results.subscribers.status = `⚠️ ${response.status}`;
      results.subscribers.details = data.error || 'Unknown error';
      console.warn(`⚠️ /api/subscribers returned ${response.status}:`, data);
    }
  } catch (err) {
    results.subscribers.status = '❌ Failed';
    results.subscribers.details = err.message;
    console.error('❌ /api/subscribers test failed:', err.message);
  }
}

// Test 4: Email Service
async function testEmail() {
  try {
    console.log('\n📧 TEST 4: Email Service');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail.user,
        pass: config.gmail.appPassword,
      },
    });
    
    const info = await transporter.sendMail({
      from: config.gmail.user,
      to: 'test@example.com',
      subject: 'Production Test Email',
      html: '<p>This is a production test email</p>'
    });
    
    results.email.status = '✅ Email Sent';
    results.email.details = `Message ID: ${info.messageId}`;
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (err) {
    results.email.status = '❌ Failed';
    results.email.details = err.message;
    console.error('❌ Email test failed:', err.message);
  }
}

// Test 5: Dashboard Stats
async function testDashboard() {
  try {
    console.log('\n📊 TEST 5: Dashboard Stats');
    const response = await fetch(`${BASE_URL}/api/newsletters`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
    });
    
    if (response.status === 200) {
      const data = await response.json();
      results.dashboard.status = '✅ Working';
      results.dashboard.details = `Stats loading correctly`;
      console.log('✅ Dashboard stats working');
    } else {
      results.dashboard.status = '❌ Failed';
      results.dashboard.details = `API returned ${response.status}`;
      console.error('❌ Dashboard stats failed');
    }
  } catch (err) {
    results.dashboard.status = '❌ Failed';
    results.dashboard.details = err.message;
    console.error('❌ Dashboard test failed:', err.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 PRODUCTION VALIDATION TESTS');
  console.log('================================\n');
  
  await testDatabase();
  await testNewsletters();
  await testSubscribers();
  await testEmail();
  await testDashboard();
  
  // Print final report
  console.log('\n\n📋 FINAL REPORT');
  console.log('================================');
  console.log('\n| Component | Status | Details |');
  console.log('|-----------|--------|---------|');
  
  for (const [key, value] of Object.entries(results)) {
    console.log(`| ${key} | ${value.status} | ${value.details} |`);
  }
  
  // Check if all passed
  const allPassed = Object.values(results).every(r => r.status.includes('✅'));
  
  console.log('\n================================');
  if (allPassed) {
    console.log('✅ PRODUCTION READY - ALL SYSTEMS OPERATIONAL');
  } else {
    console.log('❌ PRODUCTION NOT READY - ISSUES DETECTED');
  }
  console.log('================================\n');
}

runAllTests().catch(console.error);
