import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmailSend = async () => {
  console.log('Testing email configuration...\n');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email From:', process.env.EMAIL_FROM);
  console.log('Email Password:', process.env.EMAIL_PASSWORD ? '***' : 'NOT SET');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('\n❌ Email credentials not configured in .env');
    process.exit(1);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('\n📧 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    console.log('\n📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Newsletter System',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your newsletter system.</p>
        <p>If you received this, your email configuration is working correctly!</p>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n📧 Check your Gmail inbox for the test email.');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure you\'re using a Gmail App Password, not your regular password');
    console.error('2. Enable 2-factor authentication on your Gmail account');
    console.error('3. Create an App Password at: https://myaccount.google.com/apppasswords');
    console.error('4. Make sure the .env file has the correct EMAIL_USER and EMAIL_PASSWORD');
    process.exit(1);
  }
};

testEmailSend();
