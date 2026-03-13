import nodemailer from 'nodemailer';

// Vercel backend - sends emails via Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipients, subject, message } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'Recipients required' });
    }

    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message required' });
    }

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: recipient,
          subject: subject,
          html: message,
          text: message,
        });
        sent++;
      } catch (error) {
        failed++;
        console.error(`Failed to send to ${recipient}:`, error.message);
      }
    }

    res.status(200).json({
      success: failed === 0,
      sent,
      failed,
      total: recipients.length,
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
