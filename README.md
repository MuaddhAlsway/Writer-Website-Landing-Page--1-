# Author Fatima - Writer's Landing Page & Newsletter Platform

A modern, bilingual (Arabic/English) landing page and newsletter management system for an Arabic author. Built with React, TypeScript, and deployed on Cloudflare's edge network.

## 🎯 Overview

This project serves as a complete digital presence for an author, featuring:

- **Beautiful Landing Page**: Showcase book details, author bio, and reader experience
- **Email Waitlist**: Capture early readers interested in book launches
- **Admin Dashboard**: Comprehensive management system for subscribers and newsletters
- **Newsletter Platform**: Send targeted newsletters with multi-language support
- **Bilingual Support**: Full Arabic (RTL) and English (LTR) interface

**Book Featured**: "لا تكُن سَبَهْلَلًا" (Don't Be Frivolous) - A philosophical work about escaping meaninglessness and reclaiming purpose.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Cloudflare account (for deployment)
- Email service API key (Resend recommended)

### Local Development

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your email service credentials
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Frontend dev server
   npm run dev
   # Runs on http://localhost:5173

   # Terminal 2: Backend server
   npm run server
   # Runs on http://localhost:3001
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Admin Dashboard: http://localhost:5173/admin
   - Default credentials: `admin@example.com` / `admin123`

---

## 📁 Project Structure

```
project-root/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/                    # Admin dashboard components
│   │   │   │   ├── AdminDashboard.tsx    # Main dashboard
│   │   │   │   ├── AdminLogin.tsx        # Authentication
│   │   │   │   ├── DashboardStats.tsx    # Analytics & charts
│   │   │   │   ├── NewsletterManager.tsx # Newsletter creation/sending
│   │   │   │   ├── SubscribersList.tsx   # Subscriber management
│   │   │   │   ├── SendEmail.tsx         # Direct email sending
│   │   │   │   └── *Ar.tsx               # Arabic versions
│   │   │   ├── ui/                       # Reusable UI components (Radix UI)
│   │   │   ├── HeroSection.tsx           # Landing page hero
│   │   │   ├── BookStory.tsx             # Book description
│   │   │   ├── ReaderExperience.tsx      # Reader benefits
│   │   │   ├── AuthorSection.tsx         # Author bio
│   │   │   ├── BookTeaser.tsx            # Book excerpt
│   │   │   ├── EmailWaitlist.tsx         # Subscription form
│   │   │   ├── LaunchCountdown.tsx       # Launch timer
│   │   │   ├── Footer.tsx                # Footer
│   │   │   └── *Ar.tsx                   # Arabic versions
│   │   └── App.tsx                       # Main app with routing
│   ├── emails/
│   │   ├── NewsletterEmail.tsx           # Newsletter template
│   │   └── WelcomeEmail.tsx              # Welcome email template
│   ├── styles/
│   │   ├── index.css                     # Global styles
│   │   ├── tailwind.css                  # Tailwind config
│   │   └── theme.css                     # Theme variables
│   ├── utils/
│   │   └── api.ts                        # API client
│   ├── main.tsx                          # React entry point
│   └── worker.ts                         # Cloudflare Worker config
├── functions/
│   ├── api/[[route]].ts                  # API route handler
│   ├── _middleware.ts                    # Middleware
│   └── [[path]].ts                       # Catch-all routes
├── public/                               # Static assets
├── schema.sql                            # Database schema
├── server.mjs                            # Local dev server
├── wrangler.toml                         # Cloudflare config
├── vite.config.ts                        # Vite config
└── package.json                          # Dependencies
```

---

## 🛠️ Technology Stack

### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-Headless-161618?style=flat-square&logo=radixui&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-Animations-000000?style=flat-square&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Charts-8884D8?style=flat-square)
![Lucide React](https://img.shields.io/badge/Lucide%20React-Icons-F97316?style=flat-square)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-Serverless%20SQL-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Itty Router](https://img.shields.io/badge/Itty%20Router-Lightweight-FF6B6B?style=flat-square)

### Deployment & Infrastructure
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Frontend-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-Serverless-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Wrangler](https://img.shields.io/badge/Wrangler-CLI-F38020?style=flat-square&logo=cloudflare&logoColor=white)

### Email Services
![Resend](https://img.shields.io/badge/Resend-Primary%20Email-000000?style=flat-square)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Gmail%2FSMTP-0B7285?style=flat-square)
![MailerSend](https://img.shields.io/badge/MailerSend-Alternative-FF6B35?style=flat-square)
![SendGrid](https://img.shields.io/badge/SendGrid-Alternative-1A73E8?style=flat-square)
![Mailgun](https://img.shields.io/badge/Mailgun-Alternative-F06B66?style=flat-square)
![Formspree](https://img.shields.io/badge/Formspree-Forms-4A90E2?style=flat-square)

---

## 📊 Database Schema

### Tables

**subscribers**
- `id` - Primary key
- `email` - Unique email address
- `name` - Subscriber name
- `language` - Preferred language (en/ar)
- `subscribedAt` - Subscription timestamp

**admins**
- `id` - Primary key
- `email` - Unique admin email
- `password` - Hashed password
- `name` - Admin name
- `createdAt` - Creation timestamp

**newsletters**
- `id` - Unique identifier
- `title` - Newsletter title
- `content` - HTML content
- `language` - Target language
- `status` - draft/sent
- `createdAt` - Creation timestamp
- `sentAt` - Send timestamp

**monthly_stats**
- `month` - Month identifier
- `count` - Subscriber count for month

---

## 🔌 API Endpoints

### Base URL
- Development: `http://localhost:3001`
- Production: `https://your-domain.com`

### Endpoints

**Health Check**
```
GET /make-server-53bed28f/health
```

**Subscribers**
```
POST   /make-server-53bed28f/subscribers          # Add subscriber
GET    /make-server-53bed28f/subscribers          # List all (auth required)
GET    /make-server-53bed28f/subscribers/stats    # Get stats (auth required)
DELETE /make-server-53bed28f/subscribers/:email   # Remove subscriber (auth required)
```

**Newsletters**
```
POST   /make-server-53bed28f/newsletters          # Create (auth required)
GET    /make-server-53bed28f/newsletters          # List (auth required)
POST   /make-server-53bed28f/newsletters/:id/send # Send (auth required)
DELETE /make-server-53bed28f/newsletters/:id      # Delete (auth required)
```

**Email**
```
POST /make-server-53bed28f/send-email             # Send direct email (auth required)
```

### Authentication
- Bearer token in `Authorization` header
- Token stored in localStorage
- Default expiry: 1 hour

---

## 📧 Email Service Setup

### Using Resend (Recommended)

1. **Create account** at [resend.com](https://resend.com)
2. **Get API key** from dashboard
3. **Set environment variable**
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Using Gmail with Nodemailer

1. **Enable 2FA** on Gmail account
2. **Generate App Password** (16-character password)
3. **Set environment variables**
   ```bash
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Alternative Services
- **MailerSend**: Set `EMAIL_SERVICE=mailersend`
- **SendGrid**: Set `EMAIL_SERVICE=sendgrid`
- **Mailgun**: Set `EMAIL_SERVICE=mailgun`

---

## 🚀 Deployment

### Deploy to Cloudflare Pages

1. **Setup Cloudflare**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Create D1 Database**
   ```bash
   wrangler d1 create newsletter-db
   wrangler d1 execute newsletter-db --file schema.sql
   ```

3. **Set Secrets**
   ```bash
   wrangler secret put RESEND_API_KEY
   wrangler secret put FROM_EMAIL
   ```

4. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### GitHub Integration
1. Connect repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output: `dist`
4. Automatic deployment on push to main

---

## 👨‍💼 Admin Dashboard

### Features

**Overview Tab**
- Total subscriber count
- Active subscriber estimate
- Monthly signup statistics
- Subscription trend charts
- Cumulative growth visualization

**Subscribers Tab**
- View all subscribers
- Search and filter
- Delete individual subscribers
- Language preference tracking
- Subscription date display

**Newsletter Manager Tab**
- Create newsletters with rich text editor
- Newsletter templates library
- Featured image support
- Language targeting (EN/AR/Both)
- Draft/sent status tracking
- Send to all subscribers
- Preview before sending
- Delivery tracking

**Email Sending Tab**
- Send direct emails to recipients
- Custom subject and content
- HTML content support
- Batch sending with rate limiting
- Delivery status

### Default Credentials
```
Email: admin@example.com
Password: admin123
```

⚠️ **Change these credentials in production!**

---

## 🌍 Bilingual Support

The application supports both Arabic and English:

- **Arabic (RTL)**: Full right-to-left layout
- **English (LTR)**: Standard left-to-right layout
- **Component Naming**: `*Ar.tsx` for Arabic versions
- **Language Toggle**: Available in app header
- **Email Preferences**: Subscribers can choose preferred language

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server (port 5173)
npm run server          # Start backend server (port 3001)

# Production
npm run build           # Build for production
npm run deploy          # Deploy to Cloudflare

# Database
npm run db:create       # Create D1 database
npm run db:init         # Initialize schema
npm run db:info         # Show database info

# Secrets
npm run secret:set      # Set Cloudflare secret
npm run secret:list     # List all secrets

# Monitoring
npm run logs            # View Cloudflare logs
```

---

## 🔐 Security Considerations

1. **Change default admin credentials** before production
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** (automatic with Cloudflare)
4. **Validate email addresses** on subscription
5. **Rate limit API endpoints** to prevent abuse
6. **Hash passwords** (use bcrypt or similar)
7. **Implement CSRF protection** for forms
8. **Sanitize user input** to prevent XSS

---

## 🐛 Troubleshooting

### Email not sending
- Check API key is set correctly
- Verify email service credentials
- Check rate limits (Resend: 100/day free tier)
- Review email templates for HTML errors

### Database errors
- Ensure schema.sql is initialized: `npm run db:init`
- Check database file permissions
- Verify D1 database binding in wrangler.toml

### Admin login issues
- Clear localStorage: `localStorage.clear()`
- Check token expiry in browser console
- Verify admin credentials in database

### Bilingual display issues
- Check `dir="rtl"` attribute on HTML element
- Verify Tailwind CSS is processing RTL classes
- Clear browser cache

---

## 📚 Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Resend Email API](https://resend.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI Components](https://www.radix-ui.com)

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👤 Author

Built for Author Fatima's digital presence and newsletter platform.

---

## 🤝 Support

For issues or questions, please refer to the deployment guides in the project root directory:
- `DEPLOYMENT_QUICK_START.md`
- `CLOUDFLARE_DEPLOYMENT.md`
- `ADMIN_GUIDE.md`
