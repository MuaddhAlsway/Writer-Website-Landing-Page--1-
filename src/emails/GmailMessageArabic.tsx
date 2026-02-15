export function getGmailMessageTemplateArabic(subject: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          padding: 20px;
          min-height: 100vh;
          direction: rtl;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          padding: 35px 20px;
          text-align: center;
          color: white;
          border-bottom: 4px solid #ea4335;
        }
        .header-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 35px 30px;
          text-align: right;
        }
        .message-title {
          color: #1e3c72;
          font-size: 22px;
          margin-bottom: 20px;
          font-weight: 600;
          border-bottom: 2px solid #ea4335;
          padding-bottom: 12px;
        }
        .message-body {
          color: #333;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .message-body p {
          margin-bottom: 15px;
        }
        .highlight-box {
          background: #f0f4ff;
          border-right: 4px solid #ea4335;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
          text-align: right;
        }
        .highlight-box p {
          color: #1e3c72;
          font-weight: 500;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #ea4335 0%, #c5221f 100%);
          color: white;
          padding: 12px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 15px;
          margin: 20px 0;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(234, 67, 53, 0.4);
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(234, 67, 53, 0.6);
        }
        .divider {
          height: 1px;
          background: #e0e0e0;
          margin: 25px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        .footer-text {
          color: #666;
          font-size: 12px;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .footer-links {
          margin: 12px 0;
        }
        .footer-links a {
          color: #ea4335;
          text-decoration: none;
          font-size: 12px;
          margin: 0 8px;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
        .copyright {
          color: #999;
          font-size: 11px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }
        .gmail-badge {
          display: inline-block;
          background: #ea4335;
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-icon">📧</div>
          <h1>رسالة من الرحلة</h1>
          <p>رسالة خاصة لمشتركينا الكرام</p>
        </div>

        <div class="content">
          <div style="text-align: center;">
            <span class="gmail-badge">📬 رسالة Gmail</span>
          </div>

          <div class="message-title">${subject}</div>

          <div class="message-body">
            ${content.split('\n').map(line => line.trim() ? \`<p>\${line}</p>\` : '').join('')}
          </div>

          <div class="highlight-box">
            <p>شكراً لك على كونك جزءاً من مجتمعنا!</p>
          </div>

          <div class="divider"></div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://thejourney.com" class="cta-button">زيارة موقعنا</a>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">
            تتلقى هذا البريد الإلكتروني لأنك مشترك في قائمتنا البريدية.
          </p>
          <div class="footer-links">
            <a href="#">إدارة التفضيلات</a>
            <span style="color: #ccc;">•</span>
            <a href="#">إلغاء الاشتراك</a>
          </div>
          <p class="copyright">
            © 2026 الرحلة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
