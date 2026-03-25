const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

export const onRequest: PagesFunction = async (context: any) => {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'Valid email required' }, 400);
    }

    // Generate a reset token
    const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    // Store token in KV if available
    if (env.KV) {
      await env.KV.put(`reset:${token}`, JSON.stringify({ email, expiresAt }), {
        expirationTtl: 3600,
      });
    }

    // Send reset email if Gmail is configured
    if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
      const frontendUrl = env.FRONTEND_URL || 'https://main.author-fatima-76r-eis.pages.dev';
      const resetLink = `${frontendUrl}/admin/reset-password?token=${token}`;

      await sendResetEmail(email, resetLink, env);
    } else {
      console.log(`[forgot-password] Reset token for ${email}: ${token}`);
    }

    // Always return success to avoid email enumeration
    return json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return json({ error: 'Request failed' }, 500);
  }
};

async function sendResetEmail(email: string, resetLink: string, env: any) {
  // Use MailChannels (free on Cloudflare Pages/Workers)
  const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: env.GMAIL_USER, name: 'Admin' },
      subject: 'Password Reset Request',
      content: [
        {
          type: 'text/html',
          value: `
            <p>You requested a password reset.</p>
            <p><a href="${resetLink}">Click here to reset your password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you did not request this, ignore this email.</p>
          `,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email send failed: ${text}`);
  }
}
