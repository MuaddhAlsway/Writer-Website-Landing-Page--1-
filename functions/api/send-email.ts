import nodemailer from 'nodemailer';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Nodemailer transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const onRequest: PagesFunction = async (context) => {
  // Handle OPTIONS requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { recipients, subject, content, image, language = 'en' } = await context.request.json();

    if (!recipients || !subject || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const transporter = getTransporter();
    const results = [];
    let sentCount = 0;

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: recipient,
          subject: subject,
          html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient}:`, info.response);
        results.push({
          email: recipient,
          success: true,
          messageId: info.messageId,
        });
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send email to ${recipient}:`, err.message);
        results.push({
          email: recipient,
          success: false,
          error: err.message,
        });
      }
    }

    const failureCount = results.filter(r => !r.success).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Sent to ${sentCount} recipients, ${failureCount} failed`,
      count: sentCount,
      recipientCount: sentCount,
      results: results,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Send email error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email', details: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
