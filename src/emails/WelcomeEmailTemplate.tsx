export function getWelcomeEmailTemplate(subscriberEmail: string, subscriberName?: string) {
  const name = subscriberName || subscriberEmail.split('@')[0];
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to The Journey Newsletter</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          min-height: 100vh;
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
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .features {
          background: #f8f9ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 6px;
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
          padding-left: 24px;
          position: relative;
        }
        .features li:before {
          content: "✓";
          position: absolute;
          left: 0;
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
        @media (max-width: 600px) {
          .container {
            border-radius: 0;
          }
          .header {
            padding: 30px 15px;
          }
          .header h1 {
            font-size: 24px;
          }
          .content {
            padding: 25px 15px;
          }
          .welcome-section h2 {
            font-size: 20px;
          }
          .cta-button {
            display: block;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="header-icon">📧</div>
          <h1>The Journey</h1>
          <p>Exclusive Updates & Early Access</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Gmail Badge -->
          <div style="text-align: center;">
            <span class="gmail-badge">📬 Newsletter</span>
          </div>

          <!-- Welcome Section -->
          <div class="welcome-section">
            <h2>Welcome, ${name}! 🎉</h2>
            <p>Thank you for subscribing to <strong>The Journey</strong> newsletter. We're thrilled to have you on board!</p>
            <p>You're now part of an exclusive community that gets early access to our latest updates, insights, and special announcements.</p>
          </div>

          <!-- Features Section -->
          <div class="features">
            <h3>What You'll Get:</h3>
            <ul>
              <li>Exclusive early access to new content</li>
              <li>Weekly insights and updates</li>
              <li>Special offers for subscribers only</li>
              <li>Behind-the-scenes stories and updates</li>
              <li>Direct access to our community</li>
            </ul>
          </div>

          <!-- Main Message -->
          <div class="welcome-section">
            <p>We're committed to bringing you valuable content that matters. Expect to hear from us regularly with updates that will inspire and inform you.</p>
            <p><strong>Stay tuned for what's coming next!</strong></p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center;">
            <a href="https://thejourney.com" class="cta-button">Explore The Journey</a>
          </div>

          <div class="divider"></div>

          <!-- Additional Info -->
          <div class="welcome-section">
            <h2 style="font-size: 18px; color: #333;">Questions?</h2>
            <p>If you have any questions or need assistance, feel free to reach out to us. We're here to help!</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="footer-text">
            You're receiving this email because you subscribed to our newsletter.
          </p>
          <div class="footer-links">
            <a href="#">Manage Preferences</a>
            <span style="color: #ccc;">•</span>
            <a href="#">Unsubscribe</a>
          </div>
          <p class="copyright">
            © 2026 The Journey. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
