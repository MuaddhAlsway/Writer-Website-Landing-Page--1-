// Newsletter HTML Template Generator
function generateNewsletterTemplate(subject: string, content: string, language: string = 'en'): string {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';
  
  // Convert plain text to HTML paragraphs if needed
  let htmlContent = content;
  if (!content.includes('<') && !content.includes('>')) {
    // Plain text - wrap in paragraphs
    htmlContent = content
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  return `
    <!DOCTYPE html>
    <html lang="${language}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          padding: 20px;
          direction: ${direction};
          min-height: 100vh;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: oklch(0.145 0 0);
          padding: 60px 30px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }
        .header-content {
          position: relative;
          z-index: 1;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 15px;
          display: inline-block;
          width: 60px;
          height: 60px;
        }
        .header-icon svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .header h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 10px;
          word-break: break-word;
          letter-spacing: -0.5px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        .content {
          padding: 50px 40px;
          text-align: ${textAlign};
          line-height: 1.8;
          color: #333;
        }
        .content p {
          font-size: 15px;
          margin-bottom: 20px;
          color: #555;
        }
        .content h2 {
          color: #333;
          font-size: 22px;
          margin: 30px 0 15px 0;
          font-weight: 600;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }
        .content h3 {
          color: #555;
          font-size: 18px;
          margin: 20px 0 10px 0;
          font-weight: 600;
        }
        .content ul, .content ol {
          margin: 20px 0;
          padding-${isArabic ? 'right' : 'left'}: 25px;
        }
        .content li {
          margin-bottom: 12px;
          color: #555;
          font-size: 15px;
        }
        .cta-button {
          display: inline-block;
          background: oklch(0.145 0 0);
          color: white;
          padding: 16px 40px;
          border-radius: 8px;
          text-decoration: none;
          margin: 25px 0;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: none;
          cursor: pointer;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        .highlight {
          background: linear-gradient(120deg, #f0f0f015 0%, #e0e0e015 100%);
          padding: 20px;
          border-radius: 8px;
          border-${isArabic ? 'right' : 'left'}: 4px solid #333;
          margin: 20px 0;
        }
        .highlight p {
          margin: 0;
          color: #333;
        }
        .divider {
          height: 1px;
          background: #e0e0e0;
          margin: 30px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 40px 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        .footer-text {
          color: #888;
          font-size: 13px;
          margin-bottom: 15px;
        }
        .footer-links {
          margin-top: 15px;
        }
        .footer-links a {
          color: #333;
          text-decoration: none;
          margin: 0 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
        .code-block {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #333;
          margin: 15px 0;
          word-break: break-all;
        }
        @media (max-width: 600px) {
          .container {
            border-radius: 0;
          }
          .header {
            padding: 40px 20px;
          }
          .header h1 {
            font-size: 28px;
          }
          .content {
            padding: 30px 20px;
          }
          .footer {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="header-content">
              <div class="header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h1>${subject}</h1>
            </div>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p class="footer-text">
              ${isArabic ? '© 2026 جميع الحقوق محفوظة' : '© 2026 All rights reserved'}
            </p>
            <div class="footer-links">
              <a href="https://main.author-fatima-76r-eis.pages.dev">${isArabic ? 'الموقع' : 'Website'}</a>
              <a href="mailto:AuthorFSK@gmail.com">${isArabic ? 'البريد الإلكتروني' : 'Email'}</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function onRequestPost(context: any) {
  try {
    const { recipients, subject, content, language = 'en' } = await context.request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Recipients required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || !content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Subject and content required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[NEWSLETTER] Sending to ${recipients.length} recipients`);

    // Generate HTML template
    const htmlContent = generateNewsletterTemplate(subject, content, language);

    // Use Resend API if available, otherwise use backend API
    const resendApiKey = context.env.RESEND_API_KEY;
    const gmailUser = context.env.GMAIL_USER;

    if (resendApiKey && gmailUser) {
      // Use Resend API
      let sent = 0;
      let failed = 0;

      for (const recipient of recipients) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: gmailUser,
              to: recipient,
              subject: subject,
              html: htmlContent,
            }),
          });

          if (response.ok) {
            sent++;
          } else {
            failed++;
            console.error(`Failed to send to ${recipient}:`, await response.text());
          }
        } catch (error: any) {
          failed++;
          console.error(`Failed to send to ${recipient}:`, error.message);
        }
      }

      return new Response(
        JSON.stringify({
          success: failed === 0,
          sent,
          failed,
          total: recipients.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Fallback: Use backend API
      const backendUrl = context.env.BACKEND_URL;
      if (!backendUrl) {
        console.warn('[NEWSLETTER] No email service configured');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Email service not configured',
            sent: 0,
            failed: recipients.length,
            total: recipients.length,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      try {
        const response = await fetch(`${backendUrl}/send-newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients,
            subject,
            message: htmlContent,  // server-standalone.mjs expects 'message' not 'content'
            language,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          const error = await response.text();
          console.error('[NEWSLETTER] Backend error:', error);
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Backend email service failed',
              sent: 0,
              failed: recipients.length,
              total: recipients.length,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (error: any) {
        console.error('[NEWSLETTER] Backend request failed:', error.message);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to reach email service',
            sent: 0,
            failed: recipients.length,
            total: recipients.length,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error: any) {
    console.error('[NEWSLETTER] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Failed to send newsletter' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
