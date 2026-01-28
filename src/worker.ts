import { Router } from 'itty-router';
import { json, error } from 'itty-router';

const router = Router();

// In-memory storage (will reset on redeploy)
let subscribers: any[] = [];
let newsletters: any[] = [];

// Email template helper
function getEmailTemplate(title: string, content: string, type: string = 'newsletter'): string {
  const htmlContent = content.includes('<') ? content : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #2c3e50; color: #ffffff; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px; color: #555;">
                  ${htmlContent}
                </td>
              </tr>
              <tr>
                <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; border-top: 1px solid #bdc3c7;">
                  <p style="margin: 5px 0;">You received this email because you subscribed to our mailing list.</p>
                  <p style="margin: 5px 0;">&copy; 2026. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Welcome email template
function getWelcomeEmailTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
        }
        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .content {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You will now receive updates from us.</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to our newsletter.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send email via Resend
async function sendEmailViaResend(env: any, to: string, subject: string, html: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    const data = await response.json();
    return { success: true, id: data.id, service: 'resend' };
  } catch (err: any) {
    console.error(`Error sending via Resend to ${to}:`, err.message);
    throw err;
  }
}

// Health check
router.get('/make-server-53bed28f/health', () => {
  return json({ status: 'ok' });
});

// Add subscriber
router.post('/make-server-53bed28f/subscribers', async (req: any, env: any) => {
  try {
    const { email, language } = await req.json();
    
    if (!email) {
      return error(400, { error: 'Email required' });
    }

    if (subscribers.find((s: any) => s.email === email)) {
      return error(400, { error: 'Already subscribed' });
    }

    subscribers.push({
      email,
      language: language || 'en',
      subscribedAt: new Date().toISOString(),
    });

    // Send welcome email
    try {
      await sendEmailViaResend(
        env,
        email,
        'Welcome to the Journey!',
        getWelcomeEmailTemplate()
      );
    } catch (err) {
      console.error(`Failed to send welcome email to ${email}`);
    }

    return json({ success: true, subscriber: { email, language: language || 'en' } });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Get subscribers
router.get('/make-server-53bed28f/subscribers', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    return json({ subscribers, total: subscribers.length });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Get subscriber stats
router.get('/make-server-53bed28f/subscribers/stats', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    const total = subscribers.length;
    const active = Math.floor(total * 0.8);

    return json({
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: [],
    });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Delete subscriber
router.delete('/make-server-53bed28f/subscribers/:email', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    const { email } = req.params;
    const initialLength = subscribers.length;
    subscribers = subscribers.filter((s: any) => s.email !== email);

    if (subscribers.length === initialLength) {
      return error(404, { error: 'Subscriber not found' });
    }

    return json({ success: true });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Create newsletter
router.post('/make-server-53bed28f/newsletters', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    const { title, content, language } = await req.json();
    
    if (!title || !content) {
      return error(400, { error: 'Title and content are required' });
    }

    const id = `newsletter-${Date.now()}`;
    
    newsletters.push({
      id,
      title,
      content,
      language: language || 'en',
      status: 'draft',
      createdAt: new Date().toISOString(),
    });

    return json({
      success: true,
      newsletter: { id, title, content, language: language || 'en', status: 'draft' },
    });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Get newsletters
router.get('/make-server-53bed28f/newsletters', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    return json({ newsletters });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Send newsletter
router.post('/make-server-53bed28f/newsletters/:id/send', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    const { id } = req.params;
    const newsletter = newsletters.find((n: any) => n.id === id);

    if (!newsletter) {
      return error(404, { error: 'Newsletter not found' });
    }

    const results = [];

    for (let i = 0; i < subscribers.length; i++) {
      const sub = subscribers[i];
      try {
        const result = await sendEmailViaResend(
          env,
          sub.email,
          newsletter.title,
          getEmailTemplate(newsletter.title, newsletter.content, 'newsletter')
        );
        results.push({ email: sub.email, success: true, id: result.id });
      } catch (err: any) {
        results.push({ email: sub.email, success: false, error: err.message });
      }

      // Rate limiting: 500ms between sends
      if (i < subscribers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    newsletter.status = 'sent';
    newsletter.sentAt = new Date().toISOString();

    const successCount = results.filter((r: any) => r.success).length;

    return json({
      success: true,
      newsletter,
      recipientCount: subscribers.length,
      successCount,
    });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Delete newsletter
router.delete('/make-server-53bed28f/newsletters/:id', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    const { id } = req.params;
    const initialLength = newsletters.length;
    newsletters = newsletters.filter((n: any) => n.id !== id);

    if (newsletters.length === initialLength) {
      return error(404, { error: 'Newsletter not found' });
    }

    return json({ success: true });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// Send email
router.post('/make-server-53bed28f/send-email', async (req: any, env: any) => {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return error(401, { error: 'Unauthorized' });
    }

    const { recipients, subject, content } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return error(400, { error: 'Recipients array is required' });
    }

    if (!subject || !content) {
      return error(400, { error: 'Subject and content are required' });
    }

    const results = [];

    for (let i = 0; i < recipients.length; i++) {
      const email = recipients[i];
      try {
        const result = await sendEmailViaResend(
          env,
          email,
          subject,
          getEmailTemplate(subject, content, 'email')
        );
        results.push({ email, success: true, id: result.id });
      } catch (err: any) {
        results.push({ email, success: false, error: err.message });
      }

      // Rate limiting
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter((r: any) => r.success).length;

    return json({
      success: true,
      message: `Email sent to ${successCount} out of ${recipients.length} recipients`,
      recipientCount: recipients.length,
      successCount,
      results,
    });
  } catch (err: any) {
    return error(500, { error: err.message });
  }
});

// 404 handler
router.all('*', () => error(404, { error: 'Not found' }));

export default {
  fetch: router.handle,
};
