import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-server' });
});

// Verify connection
app.get('/verify-connection', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ success: true, message: 'Gmail SMTP connected' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'Recipients array required' });
    }

    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message required' });
    }

    let sent = 0;
    let failed = 0;
    const errors = [];

    // Send individual emails
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
        console.log(`✓ Sent to ${recipient}`);
      } catch (error) {
        failed++;
        errors.push({ recipient, error: error.message });
        console.error(`✗ Failed to send to ${recipient}:`, error.message);
      }
    }

    res.json({
      success: failed === 0,
      sent,
      failed,
      total: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send newsletter
app.post('/send-newsletter', async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'Recipients array required' });
    }

    let sent = 0;

    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: recipient,
          subject: subject,
          html: message,
        });
        sent++;
      } catch (error) {
        console.error(`Failed to send to ${recipient}:`, error.message);
      }
    }

    res.json({ success: true, sent, total: recipients.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📧 Email Server Running`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Port: ${PORT}`);
  console.log(`Gmail: ${process.env.GMAIL_USER || 'NOT SET'}`);
  console.log(`${'='.repeat(60)}\n`);

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Gmail connection failed:', error.message);
    } else {
      console.log('✅ Gmail SMTP connected successfully');
    }
  });
});
