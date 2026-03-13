import nodemailer from 'nodemailer';

// Initialize Gmail SMTP transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send emails to multiple recipients
 * Each recipient receives an individual email (not joined)
 * @param {string[]} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} message - Email message/content
 * @returns {Promise<{success: boolean, sent: number, failed: number, errors: Array}>}
 */
export async function sendEmails(recipients, subject, message) {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw new Error('Recipients must be a non-empty array');
  }

  if (!subject || typeof subject !== 'string') {
    throw new Error('Subject is required and must be a string');
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string');
  }

  const results = {
    success: true,
    sent: 0,
    failed: 0,
    errors: [],
  };

  // Send individual email to each recipient
  for (const recipient of recipients) {
    try {
      console.log(`[EMAIL] Sending to: ${recipient}`);

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
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
              <h1>${subject}</h1>
            </div>
            <div class="content">
              ${message}
            </div>
            <div class="footer">
              <p class="footer-text">© 2026 Author Fatima. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: recipient,
        subject: subject,
        html: htmlContent,
        text: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EMAIL] ✓ Sent to ${recipient} - Message ID: ${info.messageId}`);
      results.sent++;
    } catch (error) {
      console.error(`[EMAIL] ✗ Failed to send to ${recipient}:`, error.message);
      results.failed++;
      results.errors.push({
        recipient,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Verify Gmail SMTP connection
 * @returns {Promise<boolean>}
 */
export async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('[EMAIL] ✓ Gmail SMTP connection verified');
    return true;
  } catch (error) {
    console.error('[EMAIL] ✗ Gmail SMTP connection failed:', error.message);
    return false;
  }
}
