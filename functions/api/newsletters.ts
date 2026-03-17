import { createClient } from '@libsql/client';
import nodemailer from 'nodemailer';

let db: any;
let transporter: any;

// Simple JWT validation (for demo - in production use proper JWT library)
function validateToken(token: string, env: any): boolean {
  try {
    // For now, just check if token exists and is not empty
    // In production, verify JWT signature using env.JWT_SECRET
    if (!token || token.length < 10) {
      return false;
    }
    // TODO: Implement proper JWT verification
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch (err) {
    console.error('Token validation error:', err);
    return false;
  }
}

function initDb(env: any) {
  if (!db) {
    // Try TURSO_CONNECTION_URL first (new name), then TURSO_DATABASE_URL (old name)
    const connectionUrl = env.TURSO_CONNECTION_URL || env.TURSO_DATABASE_URL;
    const authToken = env.TURSO_AUTH_TOKEN;

    console.log('🔍 Database Connection Check:');
    console.log('   TURSO_CONNECTION_URL:', connectionUrl ? '✅ Set' : '❌ Missing');
    console.log('   TURSO_DATABASE_URL:', env.TURSO_DATABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   TURSO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');

    if (!connectionUrl || !authToken) {
      const error = 'Turso not configured - missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      console.log('📡 Connecting to Turso...');
      db = createClient({
        url: connectionUrl,
        authToken: authToken,
      });
      console.log('✅ Turso connected successfully');
    } catch (err: any) {
      console.error('❌ Turso connection failed:', err.message);
      throw new Error(`Database connection failed: ${err.message}`);
    }
  }
  return db;
}

function initTransporter(env: any) {
  if (!transporter) {
    const gmailUser = env.GMAIL_USER;
    const gmailPass = env.GMAIL_APP_PASSWORD;

    console.log('🔍 Email Service Check:');
    console.log('   GMAIL_USER:', gmailUser ? '✅ Set' : '❌ Missing');
    console.log('   GMAIL_APP_PASSWORD:', gmailPass ? '✅ Set' : '❌ Missing');

    if (!gmailUser || !gmailPass) {
      const error = 'Email service not configured - missing GMAIL_USER or GMAIL_APP_PASSWORD';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      console.log('📧 Initializing Gmail transporter...');
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
      console.log('✅ Gmail transporter initialized');
    } catch (err: any) {
      console.error('❌ Transporter initialization failed:', err.message);
      throw new Error(`Email transporter failed: ${err.message}`);
    }
  }
  return transporter;
}

function generateNewsletterTemplate(subject: string, content: string, language = 'en') {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';

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
<div class="header-icon">📬</div>
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

async function sendNewsletter(subject: string, content: string, env: any, db_instance: any) {
  try {
    let mailer;
    try {
      mailer = initTransporter(env);
    } catch (err: any) {
      console.error('❌ Email service initialization failed:', err.message);
      throw err;
    }

    // Get all subscribers
    const result = await db_instance.execute('SELECT * FROM subscribers');
    const subscribers = result.rows;

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        const language = subscriber.language || 'en';
        const htmlContent = generateNewsletterTemplate(subject, content, language);

        const mailOptions = {
          from: env.GMAIL_USER,
          to: subscriber.email,
          subject: subject,
          html: htmlContent,
          replyTo: env.GMAIL_USER,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'MIME-Version': '1.0'
          }
        };

        await mailer.sendMail(mailOptions);
        sent++;
        console.log(`✅ Newsletter sent to ${subscriber.email}`);
      } catch (err: any) {
        failed++;
        console.error(`❌ Failed to send to ${subscriber.email}:`, err.message);
      }
    }

    // Save newsletter to database
    try {
      await db_instance.execute(
        'INSERT INTO newsletters (subject, content, sentAt, recipientCount) VALUES (?, ?, ?, ?)',
        [subject, content, new Date().toISOString(), sent]
      );
      console.log(`✅ Newsletter saved to database`);
    } catch (err: any) {
      console.error('Failed to save newsletter to database:', err.message);
    }

    return { sent, failed, total: subscribers.length };
  } catch (err: any) {
    console.error('❌ Newsletter send error:', err.message);
    throw err;
  }
}

export async function onRequest(context: any) {
  const { request } = context;
  const env = context.env;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.warn('❌ Missing authorization token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing token' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Validate token
    if (!validateToken(token, env)) {
      console.warn('❌ Invalid token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // GET - List newsletters
    if (request.method === 'GET') {
      try {
        console.log('📋 Fetching newsletters from database...');
        const db_instance = initDb(env);
        
        const result = await db_instance.execute('SELECT * FROM newsletters ORDER BY sentAt DESC');
        const newsletters = result.rows.map((row: any) => ({
          id: row.id,
          subject: row.subject,
          content: row.content,
          sentAt: row.sentAt,
          recipientCount: row.recipientCount,
        }));

        console.log(`✅ Retrieved ${newsletters.length} newsletters`);
        return new Response(
          JSON.stringify({ 
            success: true,
            newsletters, 
            total: newsletters.length,
            message: `Found ${newsletters.length} newsletters`
          }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ Database error:', err.message);
        
        // Check if it's a configuration error
        if (err.message.includes('not configured') || err.message.includes('missing')) {
          return new Response(
            JSON.stringify({ 
              error: 'Database not configured', 
              details: err.message,
              hint: 'Add TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN to Cloudflare environment variables'
            }),
            { status: 503, headers: corsHeaders }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to get newsletters', 
            details: err.message,
            hint: 'Check if newsletters table exists in database'
          }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // POST - Send newsletter
    if (request.method === 'POST') {
      try {
        const db_instance = initDb(env);
        const body = await request.json();
        const { subject, content } = body;

        if (!subject || !content) {
          return new Response(
            JSON.stringify({ error: 'Subject and content required' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const result = await sendNewsletter(subject, content, env, db_instance);

        return new Response(
          JSON.stringify({
            success: true,
            message: `Newsletter sent to ${result.sent} subscribers`,
            ...result
          }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err: any) {
        console.error('❌ Newsletter error:', err.message);
        
        // Check if it's a configuration error
        if (err.message.includes('not configured') || err.message.includes('missing')) {
          return new Response(
            JSON.stringify({ 
              error: 'Database not configured', 
              details: err.message,
              hint: 'Add TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN to Cloudflare environment variables'
            }),
            { status: 503, headers: corsHeaders }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Failed to send newsletter', details: err.message }),
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
