import fetch from 'node-fetch';

async function testWelcomeEmail() {
  console.log('🧪 Testing Welcome Email for New Subscriber...\n');

  const testEmail = `test-${Date.now()}@example.com`;
  
  const subscribeData = {
    email: testEmail,
    language: 'en'
  };

  try {
    console.log('📧 Subscribing email:', testEmail);
    console.log('Language: English');
    
    const response = await fetch('https://writer-website-landing-page-1.vercel.app/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscribeData)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testWelcomeEmailArabic() {
  console.log('🧪 Testing Welcome Email (Arabic) for New Subscriber...\n');

  const testEmail = `test-ar-${Date.now()}@example.com`;
  
  const subscribeData = {
    email: testEmail,
    language: 'ar'
  };

  try {
    console.log('📧 Subscribing email:', testEmail);
    console.log('Language: Arabic');
    
    const response = await fetch('https://writer-website-landing-page-1.vercel.app/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscribeData)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   WELCOME EMAIL TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════\n');

  await testWelcomeEmail();
  await testWelcomeEmailArabic();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('   ✅ Tests completed!');
  console.log('   Check your email inbox for welcome messages.');
  console.log('═══════════════════════════════════════════════════════════');
}

runTests().catch(console.error);
