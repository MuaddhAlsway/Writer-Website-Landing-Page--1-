import nodemailer from 'nodemailer';
import { generateNewsletterTemplate } from './newsletter-template.js';

let transporter;

function initTransporter() {
  if (!transporter) {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.error('Gmail credentials missing:', { gmailUser: !!gmailUser, gmailPass: !!gmailPass });
      throw new Error('Gmail credentials not configured');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }
  return transporter;
}

// Convert plain text to HTML
function convertToHtml(text) {
  if (!text.includes('<') && !text.includes('>')) {
    // Plain text - wrap in paragraphs
    return text
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
  return text;
}

export default async function handler(req, res) {
  // CORS headers - MUST be set before any response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests - MUST return 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipients, subject, content, language = 'en', id } = req.body;
  
  try {
    // Validate input
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients required' });
    }
    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content required' });
    }

    // Initialize transporter
    const mailer = initTransporter();

    const results = [];
    let sentCount = 0;
    
    // Convert content to HTML if needed
    const htmlContent = convertToHtml(content);
    
    // Generate HTML template for newsletter
    const newsletterTemplate = generateNewsletterTemplate(subject, htmlContent, language);

    for (const recipient of recipients) {
      try {
        const recipientEmail = typeof recipient === 'string' ? recipient : recipient.email;
        
        if (!recipientEmail) {
          results.push({
            email: recipient,
            success: false,
            error: 'Invalid email address',
          });
          continue;
        }

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: recipientEmail,
          subject: subject,
          html: newsletterTemplate,
          replyTo: process.env.GMAIL_USER,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'MIME-Version': '1.0'
          }
        };

        console.log(`Attempting to send email to ${recipientEmail}...`);
        console.log(`Template length: ${newsletterTemplate.length} characters`);
        const info = await mailer.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipientEmail}:`, info.messageId);
        
        results.push({
          email: recipientEmail,
          success: true,
          messageId: info.messageId,
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send email to ${recipient}:`, err.message);
        results.push({
          email: typeof recipient === 'string' ? recipient : recipient.email,
          success: false,
          error: err.message,
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Sent to ${sentCount} recipients, ${results.length - sentCount} failed`,
      sentCount: sentCount,
      recipientCount: sentCount,
      totalRecipients: recipients.length,
      results: results,
    });
  } catch (err) {
    console.error('Send newsletter error:', err);
    return res.status(500).json({ 
      error: 'Failed to send newsletter', 
      details: err.message 
    });
  }
}
