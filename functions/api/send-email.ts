function buildHtml(subject: string, content: string, language = 'en') {
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const align = isAr ? 'right' : 'left';
  let html = content;
  if (!content.includes('<')) {
    html = content.split('\n\n').map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }
  return `<!DOCTYPE html><html lang="${language}" dir="${dir}"><head><meta charset="UTF-8">
<style>body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;direction:${dir}}
.box{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden}
.hdr{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:40px 20px;text-align:center}
.hdr h1{margin:0;font-size:26px}.body{padding:30px 20px;text-align:${align};line-height:1.7;color:#333}
.ftr{background:#f8f9fa;padding:20px;text-align:center;font-size:12px;color:#666}
.ftr a{color:#667eea;text-decoration:none}</style></head>
<body><div class="box">
<div class="hdr"><h1>${subject}</h1></div>
<div class="body">${html}</div>
<div class="ftr"><p>© 2026 All rights reserved</p>
<p><a href="https://main.author-fatima-76r-eis.pages.dev">Website</a></p>
</div></div></body></html>`;
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { recipients, subject, content, language = 'en' } = body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return json({ error: 'recipients array required' }, 400);
  }
  if (!subject || !content) {
    return json({ error: 'subject and content required' }, 400);
  }

  const fromEmail = env.GMAIL_USER || 'noreply@author-fatima.pages.dev';
  const html = buildHtml(subject, content, language);

  // Try Resend first if key is available
  const resendKey = env.RESEND_API_KEY;
  if (resendKey) {
    let sent = 0, failed = 0;
    for (const to of recipients) {
      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: fromEmail, to, subject, html }),
        });
        r.ok ? sent++ : failed++;
      } catch { failed++; }
    }
    return json({ success: failed === 0, sent, failed, total: recipients.length });
  }

  // Fallback: MailChannels (free on Cloudflare Pages)
  let sent = 0, failed = 0;
  for (const to of recipients) {
    try {
      const r = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail, name: 'Author Fatima' },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      (r.ok || r.status === 202) ? sent++ : failed++;
    } catch { failed++; }
  }

  if (sent === 0 && failed > 0) {
    return json({
      success: false,
      error: 'Email delivery failed. Configure RESEND_API_KEY in Cloudflare env vars for reliable delivery.',
      sent, failed, total: recipients.length,
    }, 500);
  }

  return json({ success: true, sent, failed, total: recipients.length });
}
