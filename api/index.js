import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(cors({
  origin: ['https://main.author-fatima-76r-339.pages.dev', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

app.use(express.json());

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
const newsletters = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  const { recipients, subject, content, language = 'en' } = req.body;
  
  try {
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

    res.json({ 
      success: true, 
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      recipientCount: sentCount,
      results: results,
    });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

// Send newsletter endpoint
app.post('/api/send-newsletter', async (req, res) => {
  const { recipients, subject, content } = req.body;
  
  try {
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

    res.json({ 
      success: true, 
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      sentCount: sentCount,
      recipientCount: sentCount,
      results: results,
    });
  } catch (err) {
    console.error('Send newsletter error:', err);
    res.status(500).json({ error: 'Failed to send newsletter', details: err.message });
  }
});

// Subscribers endpoints
app.post('/api/subscribers', (req, res) => {
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
  
  res.json({ success: true, subscriber });
});

app.get('/api/subscribers', (req, res) => {
  const list = Array.from(subscribers.values());
  res.json({ subscribers: list, total: list.length });
});

app.delete('/api/subscribers/:email', (req, res) => {
  const { email } = req.params;
  if (subscribers.has(email)) {
    subscribers.delete(email);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Subscriber not found' });
  }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const total = subscribers.size;
  const active = Math.floor(total * 0.8);
  
  res.json({
    totalSubscribers: total,
    activeSubscribers: active,
    monthlyStats: [],
  });
});

export default app;
