import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendTestEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('📤 Sending test email to muaddhalsway@gmail.com...\n');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: 'muaddhalsway@gmail.com',
      subject: 'Test Email - Newsletter System',
      html: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
            .content { padding: 40px 30px; text-align: left; }
            .content p { color: #333; font-size: 15px; line-height: 1.8; margin-bottom: 15px; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
            .footer-text { color: #666; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Email</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>This is a test email from the newsletter system.</p>
              <p>If you received this email, it means the email sending functionality is working correctly!</p>
              <p>Best regards,<br>Author Fatima Newsletter System</p>
            </div>
            <div class="footer">
              <p class="footer-text">© 2026 All rights reserved</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n📧 Check muaddhalsway@gmail.com for the test email.');
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    process.exit(1);
  }
};

sendTestEmail();
