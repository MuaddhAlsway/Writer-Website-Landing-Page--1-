import nodemailer from 'nodemailer';
import { generateEmailTemplate } from './email-template.js';
import crypto from 'crypto';

// Setup Nodemailer with Gmail
let transporter;

function initTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

// In-memory storage for reset tokens
const resetTokens = new Map();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, language = 'en' } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1 hour

    // Store token
    resetTokens.set(token, {
      email,
      expiresAt,
      used: false,
    });

    // Create reset link
    const resetLink = `https://main.author-fatima-76r-eis.pages.dev/reset-password?token=${token}`;

    // Email content
    const isArabic = language === 'ar';
    const emailContent = isArabic ? `
      <p>مرحبا،</p>
      <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإعادة تعيين كلمة المرور الخاصة بك:</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="cta-button">إعادة تعيين كلمة المرور</a>
      </div>
      <p>أو انسخ والصق هذا الرابط في متصفحك:</p>
      <div class="code-block">${resetLink}</div>
      <p>هذا الرابط سينتهي صلاحيته خلال ساعة واحدة.</p>
      <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.</p>
    ` : `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the button below to reset your password:</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="cta-button">Reset Password</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <div class="code-block">${resetLink}</div>
      <p>This link will expire in one hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `;

    const subject = isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password';
    const htmlContent = generateEmailTemplate(subject, emailContent, language);

    // Send email
    const mailer = initTransporter();
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: htmlContent,
      replyTo: process.env.GMAIL_USER,
    };

    console.log(`Sending password reset email to ${email}...`);
    const info = await mailer.sendMail(mailOptions);
    console.log(`Password reset email sent:`, info.messageId);

    return res.status(200).json({
      success: true,
      message: isArabic ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' : 'Password reset link sent to your email',
      token: token, // For testing only - remove in production
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      error: 'Failed to send password reset email',
      details: err.message,
    });
  }
}
