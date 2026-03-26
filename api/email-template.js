export function generateEmailTemplate(subject, content, language = 'en') {
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
body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.header { background: linear-gradient(135deg, #030213 0%, #030213 100%); color: white; padding: 40px 20px; text-align: center; }
.header-icon { font-size: 48px; margin-bottom: 15px; }
.header h1 { margin: 0; font-size: 28px; font-weight: bold; }
.content { padding: 40px 20px; text-align: ${textAlign}; line-height: 1.6; color: #333; }
.content p { margin: 0 0 15px 0; font-size: 14px; }
.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
.footer a { color: #030213; text-decoration: none; }
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
<p><a href="mailto:AuthorFSK@gmail.com">Email</a></p>
</div>
</div>
</body>
</html>`;
}
