import nodemailer from 'nodemailer';
import { validateConfig, logConfig } from '../config';

let transporter: any = null;
let configCache: any = null;

function getConfig(env: any) {
  if (!configCache) {
    configCache = validateConfig(env);
    logConfig(configCache);
  }
  return configCache;
}

function initTransporter(env: any) {
  if (!transporter) {
    const config = getConfig(env);
    
    try {
      console.log('📧 Initializing Gmail transporter...');
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.gmail.user,
          pass: config.gmail.appPassword,
        },
      });
      console.log('✅ Gmail transporter initialized');
    } catch (err: any) {
      console.error('❌ Transporter failed:', err.message);
      throw new Error(`Email transporter failed: ${err.message}`);
    }
  }
  return transporter;
}

function generateEmailTemplate(subject: string, content: string, language: string = 'en'): string {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';
  
  let htmlContent = content;
  if (!content.includes('<') && !content.includes('>')) {
    htmlContent = content
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  return `<!DOCTYPE html>
<html lang="${language}" dir="${direction}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
<style>
body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; direction: ${direction}; }
.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
.header h1 { margin: 0; font-size: 28px; font-weight: bold; }
.content { padding: 40px 20px; text-align: ${textAlign}; line-height: 1.6; color: #333; }
.content p { margin: 0 0 15px 0; font-size: 14px; }
.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
.footer a { color: #667eea; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>${subject}</h1>
</div>
<div class="content">
${htmlContent}
</div>
<div class="footer">
<p>© 2026 All rights reserved</p>
<p><a href="https://main.author-fatima-76r-eis.pages.dev">Website</a> | <a href="mailto:AuthorFSK@gmail.com">Email</a></p>
</div>
</div>
</body>
</html>`;
}

export async function onRequestPost(context: any) {
  try {
    const { recipients, subject, content, language = 'en' } = await context.request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Recipients required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || !content) {
      return new Response(
        JSON.stringify({ error: 'Subject and content required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const transporter_instance = initTransporter(context.env);
      const htmlContent = generateEmailTemplate(subject, content, language);
      
      let sent = 0;
      let failed = 0;

      for (const recipient of recipients) {
        try {
          await transporter_instance.sendMail({
            from: context.env.GMAIL_USER,
            to: recipient,
            subject: subject,
            html: htmlContent,
            replyTo: context.env.GMAIL_USER,
          });
          sent++;
          console.log(`✅ Email sent to ${recipient}`);
        } catch (err: any) {
          failed++;
          console.error(`❌ Failed to send to ${recipient}:`, err.message);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sent,
          failed,
          total: recipients.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err: any) {
      console.error('❌ Email service error:', err.message);
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          details: err.message
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('❌ Request error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
