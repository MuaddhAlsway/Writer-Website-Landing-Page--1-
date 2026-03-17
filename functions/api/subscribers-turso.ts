import { createClient } from '@libsql/client';
import nodemailer from 'nodemailer';

let db: any;
let transporter: any;

function initDb(env: any) {
  if (!db) {
    // Try to get from env object first (Cloudflare Pages)
    let connectionUrl = env?.TURSO_CONNECTION_URL;
    let authToken = env?.TURSO_AUTH_TOKEN;
    
    // Fallback to process.env (for local development)
    if (!connectionUrl) {
      connectionUrl = process.env.TURSO_CONNECTION_URL;
    }
    if (!authToken) {
      authToken = process.env.TURSO_AUTH_TOKEN;
    }

    console.log('🔍 Initializing Turso...');
    console.log('   URL exists:', !!connectionUrl);
    console.log('   Token exists:', !!authToken);
    console.log('   URL starts with:', connectionUrl?.substring(0, 20) || 'N/A');

    if (!connectionUrl || !authToken) {
      console.error('❌ Turso credentials missing!');
      console.error('   env.TURSO_CONNECTION_URL:', !!env?.TURSO_CONNECTION_URL);
      console.error('   env.TURSO_AUTH_TOKEN:', !!env?.TURSO_AUTH_TOKEN);
      console.error('   process.env.TURSO_CONNECTION_URL:', !!process.env.TURSO_CONNECTION_URL);
      console.error('   process.env.TURSO_AUTH_TOKEN:', !!process.env.TURSO_AUTH_TOKEN);
      throw new Error('Turso not configured');
    }

    try {
      db = createClient({
        url: connectionUrl,
        authToken: authToken,
      });
      console.log('✅ Turso connected successfully');
    } catch (err: any) {
      console.error('❌ Turso connection failed:', err.message);
      throw err;
    }
  }
  return db;
}

function initTransporter(env: any) {
  if (!transporter) {
    const gmailUser = env.GMAIL_USER;
    const gmailPass = env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.error('Gmail credentials missing');
      return null;
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }
  return transporter;
}

function generateWelcomeEmailTemplate(subscriberEmail: string, language = 'en') {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';

  const subject = isArabic ? 'مرحبا بك في قائمتنا البريدية' : 'Welcome to Our Newsletter';
  
  const content = isArabic ? `
<p>مرحبا بك!</p>
<p>شكراً لاشتراكك في قائمتنا البريدية. نحن سعداء جداً بانضمامك إلينا.</p>
<p>ستتلقى منا:</p>
<ul>
<li>آخر الأخبار والتحديثات</li>
<li>محتوى حصري وخاص</li>
<li>عروض وفرص خاصة</li>
</ul>
<p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
<p>شكراً لك!</p>
  ` : `
<p>Hello!</p>
<p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
<p>You'll receive:</p>
<ul>
<li>Latest news and updates</li>
<li>Exclusive content</li>
<li>Special offers and opportunities</li>
</ul>
<p>If you have any questions, feel free to reach out to us.</p>
<p>Thank you!</p>
  `;

  return `<!DOCTYPE html>
<html lang="${language}" dir="${direction}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
<style type="text/css">
body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; direction: ${direction}; }
.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
.header-icon { font-size: 48px; margin-bottom: 15px; }
.header h1 { margin: 0; font-size: 28px; font-weight: bold; }
.content { padding: 40px 20px; text-align: ${textAlign}; line-height: 1.6; color: #333; }
.content p { margin: 0 0 15px 0; font-size: 14px; }
.content ul { margin: 15px 0; padding-${isArabic ? 'right' : 'left'}: 20px; }
.content li { margin-bottom: 8px; font-size: 14px; }
.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
.footer a { color: #667eea; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="header-icon">✉️</div>
<h1>${subject}</h1>
</div>
<div class="content">
${content}
</div>
<div class="footer">
<p>© 2026 All rights reserved</p>
<p><a href="https://main.author-fatima-76r-eis.pages.dev">Website</a> | <a href="mailto:AuthorFSK@gmail.com">Email</a></p>
</div>
</div>
</body>
</html>`;
}

async function sendWelcomeEmail(email: string, language: string, env: any) {
  try {
    const mailer = initTransporter(env);
    if (!mailer) {
      console.warn('Email service not available');
      return false;
    }

    const subject = language === 'ar' ? 'مرحبا بك في قائمتنا البريدية' : 'Welcome to Our Newsletter';
    const htmlContent = generateWelcomeEmailTemplate(email, language);

    const mailOptions = {
      from: env.GMAIL_USER,
      to: email,
      subject: subject,
      html: htmlContent,
      replyTo: env.GMAIL_USER,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'MIME-Version': '1.0'
      }
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (err: any) {
    console.error(`❌ Failed to send welcome email:`, err.message);
    return false;
  }
}

export async function onRequest(context: any) {
  const { request } = context;
  const env = context.env;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Debug: Log environment variables
    console.log('📋 Environment Check:');
    console.log('   TURSO_CONNECTION_URL:', env.TURSO_CONNECTION_URL ? '✅ Present' : '❌ Missing');
    console.log('   TURSO_AUTH_TOKEN:', env.TURSO_AUTH_TOKEN ? '✅ Present' : '❌ Missing');
    console.log('   GMAIL_USER:', env.GMAIL_USER ? '✅ Present' : '❌ Missing');
    console.log('   GMAIL_APP_PASSWORD:', env.GMAIL_APP_PASSWORD ? '✅ Present' : '❌ Missing');
    
    const db_instance = initDb(env);

    // POST - Subscribe
    if (request.method === 'POST') {
      const body = await request.json();
      const { email, language } = body;
      
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        // Check if already subscribed
        const existing = await db_instance.execute(
          'SELECT * FROM subscribers WHERE email = ?',
          [email]
        );

        if (existing.rows.length > 0) {
          return new Response(
            JSON.stringify({ error: 'Already subscribed' }),
            { status: 400, headers: corsHeaders }
          );
        }

        // Add to Turso
        await db_instance.execute(
          'INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)',
          [email, language || 'en', '']
        );

        console.log(`✅ Subscriber saved to Turso: ${email}`);

        const subscriber = {
          email,
          language: language || 'en',
          subscribedAt: new Date().toISOString(),
          name: '',
        };

        if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
          sendWelcomeEmail(email, language || 'en', env).catch((err: any) => {
            console.error('Error sending welcome email:', err);
          });
        }

        return new Response(
          JSON.stringify({ success: true, subscriber }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ Database error:', err.message);
        return new Response(
          JSON.stringify({ error: 'Database error', details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // GET - List subscribers
    if (request.method === 'GET') {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: corsHeaders }
        );
      }

      try {
        const result = await db_instance.execute('SELECT * FROM subscribers ORDER BY subscribedAt DESC');
        const subscribers = result.rows.map((row: any) => ({
          email: row.email,
          language: row.language,
          subscribedAt: row.subscribedAt,
          name: row.name,
        }));

        console.log(`✅ Retrieved ${subscribers.length} subscribers from Turso`);
        return new Response(
          JSON.stringify({ subscribers, total: subscribers.length }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ Database error:', err.message);
        return new Response(
          JSON.stringify({ error: 'Database error', details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // DELETE - Remove subscriber
    if (request.method === 'DELETE') {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: corsHeaders }
        );
      }

      try {
        const body = await request.json();
        const { email } = body;
        const result = await db_instance.execute(
          'DELETE FROM subscribers WHERE email = ?',
          [email]
        );

        if (result.rowsAffected > 0) {
          console.log(`✅ Subscriber deleted from Turso: ${email}`);
          return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: corsHeaders }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Subscriber not found' }),
          { status: 404, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ Database error:', err.message);
        return new Response(
          JSON.stringify({ error: 'Database error', details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('❌ API error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Server error', details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
