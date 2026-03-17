/**
 * Production Email Backend Server
 * 
 * This is the main backend server that handles email sending.
 * It receives requests from the Cloudflare Worker and sends emails via Gmail SMTP.
 * 
 * Architecture:
 * Frontend → Cloudflare Worker → This Server → Gmail SMTP → Recipient Inbox
 * 
 * Key Features:
 * - Individual email sending (not comma-joined)
 * - Gmail SMTP with app password authentication
 * - Error handling and logging
 * - CORS support for Cloudflare Pages
 * - Health check endpoint
 */

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS configuration - allow requests from Cloudflare Pages
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://*.pages.dev',
    'https://*.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());

// ============================================================================
// EMAIL SERVICE SETUP
// ============================================================================

const emailUser = process.env.EMAIL_USER || 'AuthorFSK@gmail.com';
const emailPassword = process.env.EMAIL_PASSWORD || 'peed qvhs ekmo kisv';

console.log('\n' + '='.repeat(70));
console.log('📧 EMAIL SERVICE CONFIGURATION');
console.log('='.repeat(70));
console.log(`Email User: ${emailUser}`);
console.log(`Password Length: ${emailPassword.length} characters`);
console.log(`Service: Gmail SMTP`);
console.log('='.repeat(70) + '\n');

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

// Verify Gmail connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail SMTP Connection Failed:');
    console.error(`   Error: ${error.message}`);
    console.error('   Please verify:');
    console.error('   1. EMAIL_USER is correct');
    console.error('   2. EMAIL_PASSWORD is a valid Gmail app password');
    console.error('   3. 2FA is enabled on Gmail account');
  } else {
    console.log('✅ Gmail SMTP Connection Successful');
    console.log(`   Connected as: ${emailUser}`);
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'email-backend',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// EMAIL SENDING ENDPOINT
// ============================================================================

/**
 * POST /make-server-53bed28f/send-email
 * 
 * Send email to one or more recipients
 * 
 * Request body:
 * {
 *   "recipients": ["email@example.com", "another@example.com"],
 *   "subject": "Email Subject",
 *   "content": "<p>HTML email content</p>",
 *   "language": "en" (optional)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Sent to 2 recipients, 0 failed",
 *   "recipientCount": 2,
 *   "results": [
 *     { "email": "email@example.com", "success": true, "messageId": "..." },
 *     { "email": "another@example.com", "success": true, "messageId": "..." }
 *   ]
 * }
 */
app.post('/make-server-53bed28f/send-email', async (req, res) => {
  try {
    const { recipients, subject, content, language = 'en' } = req.body;

    // Validate request
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: 'Recipients required',
        message: 'recipients must be a non-empty array of email addresses',
      });
    }

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({
        error: 'Subject required',
        message: 'subject must be a non-empty string',
      });
    }

    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        error: 'Content required',
        message: 'content must be a non-empty string',
      });
    }

    console.log(`\n📨 Sending Email`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Recipients: ${recipients.length}`);
    console.log(`   Language: ${language}`);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Send email to EACH recipient individually
    // This is critical - Gmail SMTP rejects comma-joined recipients
    for (const recipient of recipients) {
      try {
        // Validate email format
        if (!recipient || typeof recipient !== 'string' || !recipient.includes('@')) {
          throw new Error('Invalid email format');
        }

        // Prepare email options
        const mailOptions = {
          from: process.env.EMAIL_FROM || emailUser,
          to: recipient, // IMPORTANT: Single recipient, not comma-joined
          subject: subject,
          html: content,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log(`   ✅ Sent to ${recipient}`);
        console.log(`      Message ID: ${info.messageId}`);

        results.push({
          email: recipient,
          success: true,
          messageId: info.messageId,
        });

        successCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Failed to send to ${recipient}`);
        console.error(`      Error: ${errorMessage}`);

        results.push({
          email: recipient,
          success: false,
          error: errorMessage,
        });

        failureCount++;
      }
    }

    console.log(`\n📊 Email Sending Results`);
    console.log(`   Successful: ${successCount}/${recipients.length}`);
    console.log(`   Failed: ${failureCount}/${recipients.length}`);
    console.log('');

    // Return results
    res.json({
      success: successCount > 0,
      message: `Sent to ${successCount} recipient(s), ${failureCount} failed`,
      recipientCount: successCount,
      totalRecipients: recipients.length,
      results: results,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Send email error:', errorMessage);

    res.status(500).json({
      error: 'Failed to send email',
      message: errorMessage,
    });
  }
});

// ============================================================================
// NEWSLETTER SENDING ENDPOINT
// ============================================================================

/**
 * POST /make-server-53bed28f/send-newsletter
 * 
 * Send newsletter to multiple recipients
 * Same as send-email but with newsletter-specific handling
 */
app.post('/make-server-53bed28f/send-newsletter', async (req, res) => {
  try {
    const { recipients, subject, content, language = 'en' } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: 'Recipients required',
      });
    }

    if (!subject || !content) {
      return res.status(400).json({
        error: 'Subject and content required',
      });
    }

    console.log(`\n📰 Sending Newsletter`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Recipients: ${recipients.length}`);

    const results = [];
    let successCount = 0;

    // Send to each recipient individually
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM || emailUser,
          to: recipient.email || recipient, // Handle both object and string
          subject: subject,
          html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`   ✅ Sent to ${recipient.email || recipient}`);

        results.push({
          email: recipient.email || recipient,
          success: true,
          messageId: info.messageId,
        });

        successCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Failed to send to ${recipient.email || recipient}`);

        results.push({
          email: recipient.email || recipient,
          success: false,
          error: errorMessage,
        });
      }
    }

    console.log(`\n📊 Newsletter Results: ${successCount}/${recipients.length} sent\n`);

    res.json({
      success: successCount > 0,
      message: `Newsletter sent to ${successCount} recipient(s)`,
      recipientCount: successCount,
      results: results,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Newsletter error:', errorMessage);

    res.status(500).json({
      error: 'Failed to send newsletter',
      message: errorMessage,
    });
  }
});

// ============================================================================
// VERIFY CONNECTION ENDPOINT
// ============================================================================

app.get('/verify-connection', (req, res) => {
  transporter.verify((error, success) => {
    if (error) {
      res.status(500).json({
        success: false,
        error: 'Gmail SMTP connection failed',
        details: error.message,
      });
    } else {
      res.json({
        success: true,
        message: 'Gmail SMTP connection successful',
        email: emailUser,
      });
    }
  });
});

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

// ============================================================================
// ERROR HANDLER
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 EMAIL BACKEND SERVER STARTED');
  console.log('='.repeat(70));
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`Verify Connection: http://localhost:${PORT}/verify-connection`);
  console.log('='.repeat(70) + '\n');
});

export default app;
