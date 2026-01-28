import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';
let adminToken = null;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`❌ API request failed: ${url}`, err.message);
    throw err;
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('\n📋 Test 1: Health Check');
  try {
    const result = await apiRequest('/make-server-53bed28f/health');
    console.log('✅ Server is healthy:', result);
    return true;
  } catch (err) {
    console.error('❌ Health check failed');
    return false;
  }
}

// Test 2: Add Test Subscribers
async function testAddSubscribers() {
  console.log('\n📋 Test 2: Add Test Subscribers');
  try {
    const emails = [
      { email: 'subscriber1@example.com', language: 'en' },
      { email: 'subscriber2@example.com', language: 'en' },
      { email: 'subscriber3@example.com', language: 'ar' },
    ];

    for (const sub of emails) {
      try {
        const result = await apiRequest('/make-server-53bed28f/subscribers', {
          method: 'POST',
          body: JSON.stringify(sub),
        });
        console.log(`✅ Added subscriber: ${sub.email}`);
      } catch (err) {
        if (err.message.includes('Already subscribed')) {
          console.log(`⚠️  Subscriber already exists: ${sub.email}`);
        } else {
          throw err;
        }
      }
    }
    return true;
  } catch (err) {
    console.error('❌ Failed to add subscribers');
    return false;
  }
}

// Test 3: Get Subscribers (requires auth)
async function testGetSubscribers() {
  console.log('\n📋 Test 3: Get Subscribers');
  try {
    // First, we need to get a token by logging in
    // For now, we'll use a mock token
    adminToken = 'test-token';
    
    const result = await apiRequest('/make-server-53bed28f/subscribers');
    console.log(`✅ Retrieved ${result.total} subscribers`);
    console.log('Subscribers:', result.subscribers.map(s => s.email).join(', '));
    return true;
  } catch (err) {
    console.error('❌ Failed to get subscribers');
    return false;
  }
}

// Test 4: Create Newsletter
async function testCreateNewsletter() {
  console.log('\n📋 Test 4: Create Newsletter');
  try {
    const newsletter = {
      title: 'Test Newsletter - Welcome to Our Community!',
      content: '<h2>Hello Subscribers!</h2><p>This is a <strong>test newsletter</strong> with <em>rich formatting</em>.</p><ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul>',
      language: 'en',
    };

    const result = await apiRequest('/make-server-53bed28f/newsletters', {
      method: 'POST',
      body: JSON.stringify(newsletter),
    });

    console.log('✅ Newsletter created:', result.newsletter.id);
    console.log('   Title:', result.newsletter.title);
    console.log('   Status:', result.newsletter.status);
    return result.newsletter.id;
  } catch (err) {
    console.error('❌ Failed to create newsletter');
    return null;
  }
}

// Test 5: Get Newsletters
async function testGetNewsletters() {
  console.log('\n📋 Test 5: Get Newsletters');
  try {
    const result = await apiRequest('/make-server-53bed28f/newsletters');
    console.log(`✅ Retrieved ${result.newsletters.length} newsletters`);
    result.newsletters.forEach(n => {
      console.log(`   - ${n.title} (${n.status})`);
    });
    return true;
  } catch (err) {
    console.error('❌ Failed to get newsletters');
    return false;
  }
}

// Test 6: Send Newsletter
async function testSendNewsletter(newsletterId) {
  console.log('\n📋 Test 6: Send Newsletter');
  if (!newsletterId) {
    console.log('⚠️  Skipping - no newsletter ID');
    return false;
  }

  try {
    console.log(`📧 Sending newsletter ${newsletterId}...`);
    const result = await apiRequest(`/make-server-53bed28f/newsletters/${newsletterId}/send`, {
      method: 'POST',
      body: JSON.stringify({}),
    });

    console.log('✅ Newsletter sent successfully!');
    console.log(`   Recipients: ${result.recipientCount}`);
    console.log(`   Successful: ${result.successCount}`);
    console.log(`   Status: ${result.newsletter.status}`);
    console.log(`   Sent at: ${result.newsletter.sentAt}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send newsletter:', err.message);
    return false;
  }
}

// Test 7: Send Direct Email
async function testSendDirectEmail() {
  console.log('\n📋 Test 7: Send Direct Email');
  try {
    const email = {
      recipients: ['subscriber1@example.com', 'subscriber2@example.com'],
      subject: 'Direct Email Test',
      content: '<h2>Direct Email Test</h2><p>This is a direct email sent to specific subscribers.</p>',
    };

    const result = await apiRequest('/make-server-53bed28f/send-email', {
      method: 'POST',
      body: JSON.stringify(email),
    });

    console.log('✅ Direct email sent successfully!');
    console.log(`   Recipients: ${result.recipientCount}`);
    console.log(`   Successful: ${result.successCount}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send direct email:', err.message);
    return false;
  }
}

// Test 8: Get Subscriber Stats
async function testGetStats() {
  console.log('\n📋 Test 8: Get Subscriber Stats');
  try {
    const result = await apiRequest('/make-server-53bed28f/subscribers/stats');
    console.log('✅ Stats retrieved:');
    console.log(`   Total Subscribers: ${result.totalSubscribers}`);
    console.log(`   Active Subscribers: ${result.activeSubscribers}`);
    console.log(`   Monthly Stats:`, result.monthlyStats);
    return true;
  } catch (err) {
    console.error('❌ Failed to get stats');
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Newsletter System Tests...');
  console.log('=' .repeat(60));

  const results = {
    passed: 0,
    failed: 0,
  };

  // Run tests in sequence
  if (await testHealthCheck()) results.passed++; else results.failed++;
  if (await testAddSubscribers()) results.passed++; else results.failed++;
  if (await testGetSubscribers()) results.passed++; else results.failed++;
  
  const newsletterId = await testCreateNewsletter();
  if (newsletterId) results.passed++; else results.failed++;
  
  if (await testGetNewsletters()) results.passed++; else results.failed++;
  if (await testSendNewsletter(newsletterId)) results.passed++; else results.failed++;
  if (await testSendDirectEmail()) results.passed++; else results.failed++;
  if (await testGetStats()) results.passed++; else results.failed++;

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  console.log('='.repeat(60));
}

// Run tests
runAllTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
