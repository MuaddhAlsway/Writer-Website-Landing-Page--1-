import { Resend } from 'resend';

function getEmailTemplate(title: string, content: string) {
  const htmlContent = content.includes('<') ? content : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #2c3e50; color: #ffffff; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px; color: #555;">
                  ${htmlContent}
                </td>
              </tr>
              <tr>
                <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; border-top: 1px solid #bdc3c7;">
                  <p style="margin: 5px 0;">You received this email because you subscribed to our mailing list.</p>
                  <p style="margin: 5px 0;">&copy; 2026. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const method = request.method;

  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  const FROM_EMAIL = context.env.FROM_EMAIL || 'noreply@news.example.com';
  const resend = new Resend(RESEND_API_KEY);

  try {
    const body = await request.json() as {
      recipients: string[];
      subject: string;
      content: string;
    };

    const { recipients, subject, content } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'Recipients array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send emails with rate limiting
    const results = [];
    for (let i = 0; i < recipients.length; i++) {
      const email = recipients[i];
      try {
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          html: getEmailTemplate(subject, content),
        });

        results.push({ email, success: true, id: result.data?.id });
      } catch (err: any) {
        results.push({ email, success: false, error: err.message });
      }

      // Rate limiting: 500ms between sends
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${successCount} out of ${recipients.length} recipients`,
        recipientCount: recipients.length,
        successCount,
        results,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
