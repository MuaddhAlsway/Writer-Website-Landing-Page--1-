import nodemailer from 'nodemailer';

// Setup Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// In-memory storage
const subscribers = new Map();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      return res.status(200).json({ status: 'ok' });
    }

    // Send email
    if (pathname === '/api/send-email' && req.method === 'POST') {
      const { recipients, subject, content, language = 'en' } = req.body;
      
      if (!recipients || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients required' });
      }

      if (!subject || !content) {
        return res.status(400).json({ error: 'Subject and content required' });
      }

      const results = [];
      let sentCount = 0;
      
      for (const recipient of recipients) {
        try {
          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: recipient,
            subject: subject,
            html: content,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${recipient}:`, info.response);
          results.push({
            email: recipient,
            success: true,
            messageId: info.messageId,
          });
          sentCount++;
        } catch (err) {
          console.error(`Failed to send email to ${recipient}:`, err.message);
          results.push({
            email: recipient,
            success: false,
            error: err.message,
          });
        }
      }

      const failureCount = results.filter(r => !r.success).length;

      return res.status(200).json({ 
        success: true, 
        message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
        recipientCount: sentCount,
        results: results,
      });
    }

    // Send newsletter
    if (pathname === '/api/send-newsletter' && req.method === 'POST') {
      const { recipients, subject, content } = req.body;
      
      if (!recipients || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients required' });
      }

      if (!subject || !content) {
        return res.status(400).json({ error: 'Subject and content required' });
      }

      const results = [];
      let sentCount = 0;
      
      for (const recipient of recipients) {
        try {
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
                  ${content}
                </div>
                <div class="footer">
                  <p class="footer-text">© 2026 All rights reserved</p>
                </div>
              </div>
            </body>
            </html>
          `;

          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: recipient.email || recipient,
            subject: subject,
            html: htmlContent,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(`Newsletter sent to ${recipient}:`, info.response);
          results.push({
            email: recipient.email || recipient,
            success: true,
            messageId: info.messageId,
          });
          sentCount++;
        } catch (err) {
          console.error(`Failed to send newsletter to ${recipient}:`, err.message);
          results.push({
            email: recipient.email || recipient,
            success: false,
            error: err.message,
          });
        }
      }

      const failureCount = results.filter(r => !r.success).length;

      return res.status(200).json({ 
        success: true, 
        message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
        sentCount: sentCount,
        recipientCount: sentCount,
        results: results,
      });
    }

    // Add subscriber
    if (pathname === '/api/subscribers' && req.method === 'POST') {
      const { email, language } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      if (subscribers.has(email)) {
        return res.status(400).json({ error: 'Already subscribed' });
      }

      const subscriber = {
        email,
        language: language || 'en',
        subscribedAt: new Date().toISOString(),
      };

      subscribers.set(email, subscriber);
      
      return res.status(200).json({ success: true, subscriber });
    }

    // Get subscribers
    if (pathname === '/api/subscribers' && req.method === 'GET') {
      const list = Array.from(subscribers.values());
      return res.status(200).json({ subscribers: list, total: list.length });
    }

    // Delete subscriber
    if (pathname.startsWith('/api/subscribers/') && req.method === 'DELETE') {
      const email = pathname.split('/').pop();
      if (subscribers.has(email)) {
        subscribers.delete(email);
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Subscriber not found' });
      }
    }

    // Stats
    if (pathname === '/api/stats' && req.method === 'GET') {
      const total = subscribers.size;
      const active = Math.floor(total * 0.8);
      
      return res.status(200).json({
        totalSubscribers: total,
        activeSubscribers: active,
        monthlyStats: [],
      });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
