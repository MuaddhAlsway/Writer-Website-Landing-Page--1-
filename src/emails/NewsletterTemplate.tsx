export const getNewsletterTemplate = (subject: string, content: string, language: string = 'en') => {
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          direction: ${direction};
          text-align: ${textAlign};
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 50px 30px;
          text-align: center;
          color: white;
        }
        
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
        }
        
        .header p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .logo-section {
          text-align: center;
          padding: 20px 30px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .logo-section img {
          max-width: 150px;
          height: auto;
        }
        
        .content {
          padding: 40px 30px;
          text-align: ${textAlign};
          line-height: 1.8;
        }
        
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .content p {
          color: #555;
          font-size: 15px;
          margin-bottom: 15px;
          line-height: 1.8;
        }
        
        .content ul,
        .content ol {
          margin: 20px 0;
          padding-${isArabic ? 'right' : 'left'}: 20px;
          color: #555;
        }
        
        .content li {
          margin-bottom: 10px;
          font-size: 15px;
        }
        
        .content a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid #667eea;
          transition: all 0.3s ease;
        }
        
        .content a:hover {
          color: #764ba2;
          border-bottom-color: #764ba2;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
        }
        
        .divider {
          height: 1px;
          background: #e0e0e0;
          margin: 30px 0;
        }
        
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        
        .footer-text {
          color: #888;
          font-size: 13px;
          margin: 10px 0;
          line-height: 1.6;
        }
        
        .footer-links {
          margin: 15px 0;
        }
        
        .footer-links a {
          color: #667eea;
          text-decoration: none;
          font-size: 12px;
          margin: 0 10px;
        }
        
        .social-links {
          margin: 20px 0;
        }
        
        .social-links a {
          display: inline-block;
          width: 36px;
          height: 36px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 36px;
          margin: 0 5px;
          text-decoration: none;
          font-size: 16px;
          transition: background 0.3s ease;
        }
        
        .social-links a:hover {
          background: #764ba2;
        }
        
        .highlight {
          background: #fff3cd;
          padding: 15px;
          border-left: 4px solid #ffc107;
          margin: 20px 0;
          border-radius: 4px;
        }
        
        .highlight p {
          margin: 0;
          color: #856404;
        }
        
        @media (max-width: 600px) {
          .container {
            border-radius: 0;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .content {
            padding: 25px 20px;
          }
          
          .content h2 {
            font-size: 20px;
          }
          
          .footer {
            padding: 20px;
          }
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
          <div class="footer-text">
            ${isArabic ? '© 2026 جميع الحقوق محفوظة' : '© 2026 All rights reserved'}
          </div>
          <div class="footer-text">
            ${isArabic ? 'تم إرسال هذه الرسالة إليك لأنك مشترك في نشرتنا البريدية' : 'You received this email because you subscribed to our newsletter'}
          </div>
          <div class="footer-links">
            <a href="#">${isArabic ? 'إلغاء الاشتراك' : 'Unsubscribe'}</a>
            <a href="#">${isArabic ? 'تفضيلات' : 'Preferences'}</a>
            <a href="#">${isArabic ? 'اتصل بنا' : 'Contact'}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getWelcomeTemplate = (language: string = 'en') => {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';

  return `
    <!DOCTYPE html>
    <html lang="${isArabic ? 'ar' : 'en'}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isArabic ? 'أهلا وسهلا' : 'Welcome'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          direction: ${direction};
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 30px;
          text-align: center;
          color: white;
        }
        
        .header h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .content {
          padding: 40px 30px;
          text-align: ${textAlign};
        }
        
        .content p {
          color: #555;
          font-size: 15px;
          margin-bottom: 15px;
          line-height: 1.8;
        }
        
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        
        .footer-text {
          color: #888;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isArabic ? 'أهلا وسهلا' : 'Welcome'}</h1>
        </div>
        
        <div class="content">
          <p>${isArabic ? 'شكراً لاشتراكك في نشرتنا البريدية!' : 'Thank you for subscribing to our newsletter!'}</p>
          <p>${isArabic ? 'سنرسل لك أحدث الأخبار والمحتوى الحصري مباشرة إلى بريدك الإلكتروني.' : 'We will send you the latest news and exclusive content directly to your inbox.'}</p>
        </div>
        
        <div class="footer">
          <p class="footer-text">${isArabic ? '© 2026 جميع الحقوق محفوظة' : '© 2026 All rights reserved'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
