import fetch from 'node-fetch';

const apiKey = 'un_42TXVcIqOrO9vUkimbRYpKxexLshwiYXu';
const fromEmail = 'noreply@author.com';

async function testUnosend() {
  console.log('Testing Unosend API endpoints...\n');
  
  const endpoints = [
    'https://www.unosend.co/api/v1/emails',
    'https://api.unosend.com/emails/send',
    'https://api.unosend.co/v1/emails',
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: ['muaddhtesting@gmail.com'],
          subject: 'Test from Unosend',
          html: '<p>Test email</p>',
        }),
      });

      console.log(`Status: ${response.status}`);
      const data = await response.json();
      console.log(`Response:`, JSON.stringify(data, null, 2));
      console.log('---\n');
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
    }
  }
}

testUnosend();
