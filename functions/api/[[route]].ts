import { Router } from 'itty-router';
import { Resend } from 'resend';

const router = Router();

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
}

// Email template helper
function getEmailTemplate(title: string, content: string, type = 'newsletter'): string {
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
async function sendEmailViaResend(env: Env, to: string, subject: string, html: string) {
  const resend = new Resend(env.RESEND_API_KEY);
  
  try {
    const result = await resend.emails.send({
      from: env.FROM_EMAIL || 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true, id: result.data.id, service: 'resend' };
  } catch (err: any) {
    console.error(`Error sending via Resend to ${to}:`, err.message);
    throw err;
  }
}

// Health check
router.get('/make-server-53bed28f/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// Add subscriber
router.post('/make-server-53bed28f/subscribers', async (req, env: Env) => {
  try {
    const { email, language } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert subscriber
    const result = await env.DB.prepare(
      'INSERT INTO subscribers (email, language) VALUES (?, ?)'
    ).bind(email, language || 'en').run();

    // Send welcome email
    try {
      await sendEmailViaResend(
        env,
        email,
        'Welcome to the Journey!',
        getWelcomeEmailTemplate()
      );
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send welcome email to ${email}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      subscriber: { email, language: language || 'en' } 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'Already subscribed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get subscribers
router.get('/make-server-53bed28f/subscribers', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM subscribers ORDER BY subscribedAt DESC'
    ).all();

    return new Response(JSON.stringify({ 
      subscribers: results, 
      total: results?.length || 0 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get subscriber stats
router.get('/make-server-53bed28f/subscribers/stats', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results: countResult } = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM subscribers'
    ).all();

    const total = countResult?.[0]?.count || 0;
    const active = Math.floor(total * 0.8);

    return new Response(JSON.stringify({
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Delete subscriber
router.delete('/make-server-53bed28f/subscribers/:email', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email } = req.params;
    await env.DB.prepare('DELETE FROM subscribers WHERE email = ?').bind(email).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete subscriber' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Create newsletter
router.post('/make-server-53bed28f/newsletters', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, content, language } = await req.json();
    
    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `newsletter-${Date.now()}`;
    const lang = language && language !== 'both' ? language : 'en';

    await env.DB.prepare(
      'INSERT INTO newsletters (id, title, content, language) VALUES (?, ?, ?, ?)'
    ).bind(id, title, content, lang).run();

    return new Response(JSON.stringify({ 
      success: true, 
      newsletter: { id, title, content, language: lang, status: 'draft' }
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to create newsletter: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Get newsletters
router.get('/make-server-53bed28f/newsletters', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM newsletters ORDER BY createdAt DESC'
    ).all();

    return new Response(JSON.stringify({ newsletters: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch newsletters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Send newsletter
router.post('/make-server-53bed28f/newsletters/:id/send', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = req.params;
    const { results: newsletters } = await env.DB.prepare(
      'SELECT * FROM newsletters WHERE id = ?'
    ).bind(id).all();

    const newsletter = newsletters?.[0];
    if (!newsletter) {
      return new Response(JSON.stringify({ error: 'Newsletter not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results: subscribers } = await env.DB.prepare(
      'SELECT email FROM subscribers'
    ).all();

    console.log(`Sending newsletter to ${subscribers?.length || 0} subscribers`);

    const results = [];
    for (let i = 0; i < (subscribers?.length || 0); i++) {
      const sub = subscribers[i];
      try {
        const result = await sendEmailViaResend(
          env,
          sub.email,
          newsletter.title,
          getEmailTemplate(newsletter.title, newsletter.content, 'newsletter')
        );
        console.log(`✅ Email sent to ${sub.email}:`, result.id);
        results.push({ email: sub.email, success: true, id: result.id });
      } catch (err: any) {
        console.error(`❌ Error sending to ${sub.email}:`, err.message);
        results.push({ email: sub.email, success: false, error: err.message });
      }
      
      // Rate limiting: 500ms delay between sends
      if (i < (subscribers?.length || 0) - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    await env.DB.prepare(
      'UPDATE newsletters SET status = ?, sentAt = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('sent', id).run();

    const successCount = results.filter((r: any) => r.success).length;

    return new Response(JSON.stringify({ 
      success: true, 
      newsletter: { ...newsletter, status: 'sent' },
      recipientCount: subscribers?.length || 0,
      successCount: successCount
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to send newsletter: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Delete newsletter
router.delete('/make-server-53bed28f/newsletters/:id', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = req.params;
    await env.DB.prepare('DELETE FROM newsletters WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete newsletter' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Send direct email
router.post('/make-server-53bed28f/send-email', async (req, env: Env) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { recipients, subject, content } = await req.json();
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'Recipients array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
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
        console.log(`✅ Email sent to ${email}:`, result.id);
        results.push({ email, success: true, id: result.id });
      } catch (err: any) {
        console.error(`❌ Error sending to ${email}:`, err.message);
        results.push({ email, success: false, error: err.message });
      }
      
      // Rate limiting: 500ms delay between sends
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter((r: any) => r.success).length;

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email sent to ${successCount} out of ${recipients.length} recipients`,
      recipientCount: recipients.length,
      successCount: successCount,
      results: results
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to send email: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
});

export default router;
