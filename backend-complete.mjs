import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'https://main.author-fatima-76r-339.pages.dev'],
  credentials: true,
}));

app.use(express.json());

// Newsletter HTML template
const getNewsletterTemplate = (subject, content, language = 'en') => {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';

  return `
    <!DOCTYPE html>
    <html lang="${isArabic ? 'ar' : 'en'}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; direction: ${direction}; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; color: white; }
        .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 10px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .content { padding: 40px 30px; text-align: ${textAlign}; line-height: 1.8; }
        .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; font-weight: 600; }
        .content p { color: #555; font-size: 15px; margin-bottom: 15px; line-height: 1.8; }
        .content ul, .content ol { margin: 20px 0; padding-${isArabic ? 'right' : 'left'}: 20px; }
        .content li { margin-bottom: 10px; font-size: 15px; color: #555; }
        .content a { color: #667eea; text-decoration: none; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
        .footer-text { color: #888; font-size: 13px; margin: 10px 0; }
        .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px; }
        @media (max-width: 600px) {
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
          .content { padding: 25px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
          <p>${isArabic ? 'رسالة إخبارية حصرية' : 'Exclusive Newsletter'}</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p class="footer-text">${isArabic ? '© 2026 جميع الحقوق محفوظة' : '© 2026 All rights reserved'}</p>
          <p class="footer-text">${isArabic ? 'تم إرسال هذه الرسالة إليك لأنك مشترك في نشرتنا البريدية' : 'You received this email because you subscribed to our newsletter'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Setup Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// In-memory storage
const subscribers = new Map();
const newsletters = new Map();

// Health check
app.get('/make-server-53bed28f/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============= SUBSCRIBERS =============
app.post('/make-server-53bed28f/subscribers', (req, res) => {
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

app.get('/make-server-53bed28f/subscribers', (req, res) => {
  const list = Array.from(subscribers.values());
  res.json({ subscribers: list, total: list.length });
});

app.delete('/make-server-53bed28f/subscribers/:email', (req, res) => {
  const { email } = req.params;
  if (subscribers.has(email)) {
    subscribers.delete(email);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Subscriber not found' });
  }
});

app.get('/make-server-53bed28f/stats', (req, res) => {
  const total = subscribers.size;
  const active = Math.floor(total * 0.8);
  
  res.json({
    totalSubscribers: total,
    activeSubscribers: active,
    monthlyStats: [],
  });
});

// ============= NEWSLETTERS =============
app.post('/make-server-53bed28f/newsletters', (req, res) => {
  const { subject, content, language = 'en' } = req.body;
  
  if (!subject || !content) {
    return res.status(400).json({ error: 'Subject and content required' });
  }

  const id = `newsletter-${Date.now()}`;
  
  const newsletter = {
    id,
    subject,
    content,
    language,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };

  newsletters.set(id, newsletter);
  res.json({ success: true, newsletter });
});

app.get('/make-server-53bed28f/newsletters', (req, res) => {
  const list = Array.from(newsletters.values());
  res.json({ newsletters: list });
});

app.put('/make-server-53bed28f/newsletters/:id', (req, res) => {
  const { id } = req.params;
  const { subject, content, language } = req.body;
  
  const newsletter = newsletters.get(id);
  if (!newsletter) {
    return res.status(404).json({ error: 'Newsletter not found' });
  }

  if (subject) newsletter.subject = subject;
  if (content) newsletter.content = content;
  if (language) newsletter.language = language;
  newsletter.updatedAt = new Date().toISOString();

  res.json({ success: true, newsletter });
});

app.delete('/make-server-53bed28f/newsletters/:id', (req, res) => {
  const { id } = req.params;
  if (newsletters.has(id)) {
    newsletters.delete(id);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Newsletter not found' });
  }
});

app.post('/make-server-53bed28f/newsletters/:id/send', async (req, res) => {
  const { id } = req.params;
  const newsletter = newsletters.get(id);
  
  if (!newsletter) {
    return res.status(404).json({ error: 'Newsletter not found' });
  }

  try {
    const results = [];
    let sentCount = 0;
    
    // Get subscribers based on language
    let recipientList = Array.from(subscribers.values());
    if (newsletter.language && newsletter.language !== 'all') {
      recipientList = recipientList.filter(s => s.language === newsletter.language);
    }

    for (const recipient of recipientList) {
      try {
        const htmlContent = getNewsletterTemplate(newsletter.subject, newsletter.content, recipient.language);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject: newsletter.subject,
          html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Newsletter sent to ${recipient.email}:`, info.response);
        results.push({
          email: recipient.email,
          success: true,
          messageId: info.messageId,
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send newsletter to ${recipient.email}:`, err.message);
        results.push({
          email: recipient.email,
          success: false,
          error: err.message,
        });
      }
    }

    newsletter.status = 'sent';
    newsletter.sentAt = new Date().toISOString();
    newsletter.recipientCount = sentCount;

    const failureCount = results.filter(r => !r.success).length;

    res.json({ 
      success: true, 
      newsletter,
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      sentCount,
      recipientCount: sentCount,
      results,
    });
  } catch (err) {
    console.error('Send newsletter error:', err);
    res.status(500).json({ error: 'Failed to send newsletter', details: err.message });
  }
});

// ============= EMAIL =============
app.post('/make-server-53bed28f/send-email', async (req, res) => {
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
          from: process.env.EMAIL_USER,
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
      results,
    });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: Gmail (${process.env.EMAIL_USER})`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   /make-server-53bed28f/newsletters - Create newsletter`);
  console.log(`  GET    /make-server-53bed28f/newsletters - Get all newsletters`);
  console.log(`  PUT    /make-server-53bed28f/newsletters/:id - Update newsletter`);
  console.log(`  DELETE /make-server-53bed28f/newsletters/:id - Delete newsletter`);
  console.log(`  POST   /make-server-53bed28f/newsletters/:id/send - Send newsletter`);
  console.log(`  POST   /make-server-53bed28f/subscribers - Add subscriber`);
  console.log(`  GET    /make-server-53bed28f/subscribers - Get subscribers`);
  console.log(`  DELETE /make-server-53bed28f/subscribers/:email - Remove subscriber`);
  console.log(`  POST   /make-server-53bed28f/send-email - Send email`);
});
