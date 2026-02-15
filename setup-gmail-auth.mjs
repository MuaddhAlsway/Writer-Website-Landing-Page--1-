import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import open from 'open';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3001/auth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env');
  console.error('Get them from: https://console.cloud.google.com/apis/credentials');
  process.exit(1);
}

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
  prompt: 'consent',
});

console.log('🔐 Gmail API Authentication Setup\n');
console.log('Opening browser for authorization...\n');

// Create local server to handle callback
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const code = parsedUrl.query.code;
  const error = parsedUrl.query.error;

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>❌ Authorization Failed</h1><p>${error}</p>`);
    console.error('❌ Authorization failed:', error);
    process.exit(1);
  }

  if (code) {
    try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      
      // Save refresh token to .env
      const envPath = path.join(process.cwd(), '.env');
      let envContent = fs.readFileSync(envPath, 'utf-8');
      
      // Update or add GMAIL_REFRESH_TOKEN
      if (envContent.includes('GMAIL_REFRESH_TOKEN=')) {
        envContent = envContent.replace(
          /GMAIL_REFRESH_TOKEN=.*/,
          `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`
        );
      } else {
        envContent += `\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}`;
      }
      
      fs.writeFileSync(envPath, envContent);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>✅ Authorization Successful!</h1>
        <p>Your refresh token has been saved to .env</p>
        <p>You can now close this window and use Gmail API to send emails.</p>
      `);
      
      console.log('✅ Authorization successful!');
      console.log('✅ Refresh token saved to .env');
      console.log('\n📧 You can now send emails using Gmail API\n');
      
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Error exchanging code for tokens:', err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>❌ Error</h1><p>${err.message}</p>`);
      process.exit(1);
    }
  }
});

server.listen(3001, () => {
  console.log('📍 Waiting for authorization...');
  console.log(`📍 Callback URL: ${REDIRECT_URI}\n`);
  
  // Open browser
  open(authUrl).catch(() => {
    console.log('⚠️  Could not open browser automatically.');
    console.log('📍 Please visit this URL manually:\n');
    console.log(authUrl);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Port 3001 is already in use. Please stop other servers first.');
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});
