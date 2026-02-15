export function getNewsletterTemplateArabic(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .header p {
          font-size: 16px;
          opacity: 0.95;
          font-weight: 300;
        }
        .content {
          padding: 40px 30px;
          text-align: right;
        }
        .newsletter-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          width: 100%;
        }
        .newsletter-title {
          color: #f5576c;
          font-size: 28px;
          margin-bottom: 20px;
          font-weight: 700;
          border-bottom: 3px solid #f093fb;
          padding-bottom: 15px;
        }
        .newsletter-content {
          color: #333;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 25px;
        }
        .newsletter-content p {
          margin-bottom: 15px;
        }
        .newsletter-content h3 {
          color: #f5576c;
          font-size: 18px;
          margin-top: 20px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .newsletter-content ul {
          list-style: none;
          padding: 0;
          margin: 15px 0;
        }
        .newsletter-content li {
          color: #555;
          font-size: 14px;
          padding: 8px 0;
          padding-right: 24px;
          position: relative;
        }
        .newsletter-content li:before {
          content: "→";
          position: absolute;
          right: 0;
          color: #f5576c;
          font-weight: bold;
          font-size: 16px;
        }
        .featured-box {
          background: linear-gradient(135deg, #fff5f7 0%, #ffe5eb 100%);
          border-right: 4px solid #f5576c;
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
          text-align: right;
        }
        .featured-box h3 {
          color: #f5576c;
          margin-bottom: 10px;
        }
        .featured-box p {
          color: #555;
          font-size: 14px;
          line-height: 1.6;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          margin: 25px 0;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #f5576c, transparent);
          margin: 30px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        .footer-text {
          color: #666;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .footer-links {
          margin: 15px 0;
        }
        .footer-links a {
          color: #f5576c;
          text-decoration: none;
          font-size: 13px;
          margin: 0 10px;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
        .copyright {
          color: #999;
          font-size: 12px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-icon">📰</div>
          <h1>النشرة الإخبارية</h1>
          <p>أحدث التحديثات والأخبار</p>
        </div>

        <div class="content">
          <div class="newsletter-badge">📬 النشرة الإخبارية الأسبوعية</div>

          <div class="newsletter-title">${title}</div>

          <div class="newsletter-content">
            ${content.split('\n').map(line => {
              if (line.trim().startsWith('###')) {
                return \`<h3>\${line.replace(/^###\\s*/, '')}</h3>\`;
              }
              if (line.trim().startsWith('-')) {
                return \`<li>\${line.replace(/^-\\s*/, '')}</li>\`;
              }
              return line.trim() ? \`<p>\${line}</p>\` : '';
            }).join('')}
          </div>

          <div class="featured-box">
            <h3>✨ ملخص هذا الأسبوع</h3>
            <p>شكراً لك على متابعتك المستمرة. نتطلع إلى مشاركة المزيد من الأخبار والتحديثات معك قريباً!</p>
          </div>

          <div style="text-align: center;">
            <a href="https://thejourney.com" class="cta-button">اقرأ المزيد</a>
          </div>

          <div class="divider"></div>

          <div style="text-align: right; margin-top: 20px;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              هل لديك أفكار أو اقتراحات؟ نود أن نسمع منك! تواصل معنا عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي.
            </p>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">
            تتلقى هذا البريد الإلكتروني لأنك مشترك في نشرتنا الإخبارية.
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
