import fetch from 'node-fetch';

// Test email sending
async function testEmailTemplate() {
  console.log('🧪 Testing Email Template...\n');

  const testEmail = 'muaddhalsway@gmail.com';
  
  const emailData = {
    recipients: [testEmail],
    subject: 'Test Email Template - Professional Design',
    content: `Hello! This is a test email to verify the HTML template is working correctly.

This email should display with:
- Professional dark header with envelope icon
- Formatted paragraphs
- Responsive design
- Beautiful styling

If you see this formatted nicely, the template is working!`,
    language: 'en'
  };

  try {
    console.log('📧 Sending test email to:', testEmail);
    console.log('Subject:', emailData.subject);
    
    const response = await fetch('https://writer-website-landing-page-1.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
}

// Test newsletter sending
async function testNewsletterTemplate() {
  console.log('🧪 Testing Newsletter Template...\n');

  const testEmail = 'muaddhalsway@gmail.com';
  
  const newsletterData = {
    recipients: [testEmail],
    subject: 'Test Newsletter - Beautiful Design',
    content: `Welcome to our test newsletter!

This newsletter demonstrates the professional template with:
- Newsletter icon in the header
- Clean, readable layout
- Responsive design for all devices
- Support for both Arabic and English

Thank you for subscribing!`,
    language: 'en'
  };

  try {
    console.log('📰 Sending test newsletter to:', testEmail);
    console.log('Subject:', newsletterData.subject);
    
    const response = await fetch('https://writer-website-landing-page-1.vercel.app/api/send-newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsletterData)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error sending newsletter:', error.message);
  }
}

// Test Arabic email
async function testArabicEmailTemplate() {
  console.log('🧪 Testing Arabic Email Template...\n');

  const testEmail = 'muaddhalsway@gmail.com';
  
  const emailData = {
    recipients: [testEmail],
    subject: 'اختبار قالب البريد الإلكتروني',
    content: `مرحبا! هذا بريد اختبار للتحقق من أن قالب HTML يعمل بشكل صحيح.

يجب أن يعرض هذا البريد الإلكتروني:
- رأس داكن احترافي مع أيقونة الظرف
- فقرات منسقة
- تصميم سريع الاستجابة
- تصميم جميل

إذا رأيت هذا منسقًا بشكل جميل، فإن القالب يعمل!`,
    language: 'ar'
  };

  try {
    console.log('📧 Sending test Arabic email to:', testEmail);
    console.log('Subject:', emailData.subject);
    
    const response = await fetch('https://writer-website-landing-page-1.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error sending Arabic email:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   EMAIL & NEWSLETTER TEMPLATE TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════\n');

  await testEmailTemplate();
  await testNewsletterTemplate();
  await testArabicEmailTemplate();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('   ✅ All tests completed!');
  console.log('   Check your email inbox for the test messages.');
  console.log('═══════════════════════════════════════════════════════════');
}

runAllTests().catch(console.error);
