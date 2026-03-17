import nodemailer from 'nodemailer';

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
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// In-memory storage (will reset on each deployment)
const subscribers = new Map();
const newsletters = new Map();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

  // Health check
  if (pathname === '/api/health') {
    return res.json({ status: 'ok' });
  }

  // ============= SUBSCRIBERS =============
  if (pathname === '/api/subscribers') {
    if (req.method === 'POST') {
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
      return res.json({ success: true, subscriber });
    }

    if (req.method === 'GET') {
      const list = Array.from(subscribers.values());
      return res.json({ subscribers: list, total: list.length });
    }
  }

  // Delete subscriber
  if (pathname.match(/^\/api\/subscribers\//)) {
    if (req.method === 'DELETE') {
      const email = pathname.split('/').pop();
      if (subscribers.has(email)) {
        subscribers.delete(email);
        return res.json({ success: true });
      } else {
        return res.status(404).json({ error: 'Subscriber not found' });
      }
    }
  }

  // Stats
  if (pathname === '/api/stats') {
    const total = subscribers.size;
    const active = Math.floor(total * 0.8);
    return res.json({
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: [],
    });
  }

  // ============= NEWSLETTERS =============
  if (pathname === '/api/newsletters') {
    if (req.method === 'POST') {
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
      return res.json({ success: true, newsletter });
    }

    if (req.method === 'GET') {
      const list = Array.from(newsletters.values());
      return res.json({ newsletters: list });
    }
  }

  // Update newsletter
  if (pathname.match(/^\/api\/newsletters\//) && req.method === 'PUT') {
    const id = pathname.split('/').pop();
    const { subject, content, language } = req.body;
    
    const newsletter = newsletters.get(id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    if (subject) newsletter.subject = subject;
    if (content) newsletter.content = content;
    if (language) newsletter.language = language;
    newsletter.updatedAt = new Date().toISOString();

    return res.json({ success: true, newsletter });
  }

  // Delete newsletter
  if (pathname.match(/^\/api\/newsletters\//) && req.method === 'DELETE' && !pathname.includes('/send')) {
    const id = pathname.split('/').pop();
    if (newsletters.has(id)) {
      newsletters.delete(id);
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
  }

  // Send newsletter
  if (pathname.match(/^\/api\/newsletters\/.*\/send/) && req.method === 'POST') {
    const id = pathname.split('/')[3];
    const newsletter = newsletters.get(id);
    
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    try {
      const results = [];
      let sentCount = 0;
      
      let recipientList = Array.from(subscribers.values());
      if (newsletter.language && newsletter.language !== 'all') {
        recipientList = recipientList.filter(s => s.language === newsletter.language);
      }

      for (const recipient of recipientList) {
        try {
          const htmlContent = getNewsletterTemplate(newsletter.subject, newsletter.content, recipient.language);

          const mailOptions = {
            from: process.env.GMAIL_USER,
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

      return res.json({ 
        success: true, 
        newsletter,
        message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
        sentCount,
        recipientCount: sentCount,
        results,
      });
    } catch (err) {
      console.error('Send newsletter error:', err);
      return res.status(500).json({ error: 'Failed to send newsletter', details: err.message });
    }
  }

  // ============= EMAIL =============
  if (pathname === '/api/send-email') {
    if (req.method === 'POST') {
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

        return res.json({ 
          success: true, 
          message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
          recipientCount: sentCount,
          results,
        });
      } catch (err) {
        console.error('Send email error:', err);
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
      }
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
