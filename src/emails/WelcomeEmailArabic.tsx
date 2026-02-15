export function getWelcomeEmailArabic(subscriberEmail: string) {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>أهلا بك في رسالة الرحلة</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .welcome-section {
          margin-bottom: 30px;
        }
        .welcome-section h2 {
          color: #667eea;
          font-size: 24px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .welcome-section p {
          color: #333;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 12px;
        }
        .features {
          background: #f8f9ff;
          border-right: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 6px;
          text-align: right;
        }
        .features h3 {
          color: #667eea;
          font-size: 16px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .features ul {
          list-style: none;
          padding: 0;
        }
        .features li {
          color: #555;
          font-size: 14px;
          padding: 8px 0;
          padding-right: 24px;
          position: relative;
        }
        .features li:before {
          content: "✓";
          position: absolute;
          right: 0;
          color: #667eea;
          font-weight: bold;
          font-size: 16px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          margin: 25px 0;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
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
          color: #666;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .footer-links {
          margin: 15px 0;
        }
        .footer-links a {
          color: #667eea;
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
        .gmail-badge {
          display: inline-block;
          background: #ea4335;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-icon">📧</div>
          <h1>الرحلة</h1>
          <p>تحديثات حصرية والوصول المبكر</p>
        </div>

        <div class="content">
          <div style="text-align: center;">
            <span class="gmail-badge">📬 النشرة الإخبارية</span>
          </div>

          <div class="welcome-section">
            <h2>أهلا بك! 🎉</h2>
            <p>شكراً لاشتراكك في نشرة <strong>الرحلة</strong> الإخبارية. نحن سعداء جداً بانضمامك إلينا!</p>
            <p>أنت الآن جزء من مجتمع حصري يحصل على وصول مبكر إلى أحدث التحديثات والرؤى والإعلانات الخاصة.</p>
          </div>

          <div class="features">
            <h3>ما ستحصل عليه:</h3>
            <ul>
              <li>وصول حصري مبكر إلى محتوى جديد</li>
              <li>رؤى وتحديثات أسبوعية</li>
              <li>عروض خاصة للمشتركين فقط</li>
              <li>قصص وتحديثات من وراء الكواليس</li>
              <li>وصول مباشر إلى مجتمعنا</li>
            </ul>
          </div>

          <div class="welcome-section">
            <p>نحن ملتزمون بإحضار محتوى قيم يهمك. توقع أن تسمع منا بانتظام مع تحديثات ستلهمك وتعلمك.</p>
            <p><strong>ترقب ما سيأتي بعد ذلك!</strong></p>
          </div>

          <div style="text-align: center;">
            <a href="https://thejourney.com" class="cta-button">استكشف الرحلة</a>
          </div>

          <div class="divider"></div>

          <div class="welcome-section">
            <h2 style="font-size: 18px; color: #333;">أسئلة؟</h2>
            <p>إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، فلا تتردد في التواصل معنا. نحن هنا للمساعدة!</p>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">
            تتلقى هذا البريد الإلكتروني لأنك اشتركت في نشرتنا الإخبارية.
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
