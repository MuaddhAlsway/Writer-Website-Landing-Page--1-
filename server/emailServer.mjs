import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendEmails, verifyConnection } from './emailService.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    // Add your Cloudflare Pages domain here
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-server' });
});

// Verify Gmail connection endpoint
app.get('/verify-connection', async (req, res) => {
  try {
    const isConnected = await verifyConnection();
    res.json({ 
      success: isConnected,
      message: isConnected ? 'Gmail SMTP connected' : 'Gmail SMTP connection failed'
    });
  } catch (error) {
    console.error('[EMAIL] Verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /send-email
 * Send emails to multiple recipients
 * 
 * Request body:
 * {
 *   "recipients": ["email1@gmail.com", "email2@gmail.com"],
 *   "subject": "Email Subject",
 *   "message": "Email message content"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "sent": 2,
 *   "failed": 0,
 *   "errors": []
 * }
 */
app.post('/send-email', async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    // Validation
    if (!recipients) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array is required',
      });
    }

    if (!Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        error: 'Recipients must be an array',
      });
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array cannot be empty',
      });
    }

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Subject is required and must be a string',
      });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid email format: ${invalidEmails.join(', ')}`,
      });
    }

    console.log(`[EMAIL] Sending email to ${recipients.length} recipient(s)`);
    console.log(`[EMAIL] Subject: ${subject}`);

    // Send emails
    const result = await sendEmails(recipients, subject, message);

    // Return response
    res.json({
      success: result.failed === 0,
      sent: result.sent,
      failed: result.failed,
      total: recipients.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });

  } catch (error) {
    console.error('[EMAIL] Server error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
    });
  }
});

/**
 * POST /send-newsletter
 * Send newsletter to multiple recipients
 * 
 * Request body:
 * {
 *   "recipients": ["email1@gmail.com", "email2@gmail.com"],
 *   "subject": "Newsletter Subject",
 *   "message": "Newsletter content"
 * }
 */
app.post('/send-newsletter', async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array is required and cannot be empty',
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Subject and message are required',
      });
    }

    console.log(`[EMAIL] Sending newsletter to ${recipients.length} recipient(s)`);

    // Send emails
    const result = await sendEmails(recipients, subject, message);

    res.json({
      success: result.failed === 0,
      sent: result.sent,
      failed: result.failed,
      total: recipients.length,
    });

  } catch (error) {
    console.error('[EMAIL] Newsletter error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send newsletter',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📧 Email Server Running`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Gmail User: ${process.env.GMAIL_USER || 'NOT SET'}`);
  console.log(`${'='.repeat(60)}\n`);

  // Verify Gmail connection on startup
  verifyConnection().then(isConnected => {
    if (!isConnected) {
      console.warn('⚠️  WARNING: Gmail SMTP connection failed on startup');
      console.warn('Check your GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
    }
  });
});

export default app;
