# Writer Website - Admin Dashboard Guide

## Overview
This admin dashboard allows you to manage email subscribers, send newsletters, and track analytics for your writer's landing page.

## Features

### 1. **Dashboard Overview**
- View total subscribers count
- See active subscribers
- Track monthly signup trends
- Interactive charts showing growth over time
- Monthly breakdown table

### 2. **Subscribers Management**
- View all subscribers with email, name, language preference
- Search subscribers by email or name
- Filter by language (English/Arabic)
- Delete individual subscribers
- Export subscriber list as CSV file
- See subscription dates

### 3. **Send Email**
- Compose and send emails to selected subscribers
- Select individual recipients or use "Select All"
- Filter recipients by language
- Subject and message fields
- Track how many recipients were sent

### 4. **Newsletter Manager**
- Create newsletters with subject and content
- Target specific language groups (English/Arabic/Both)
- Save as drafts
- Send to all matching subscribers
- View sent history with recipient counts
- Delete old newsletters

## How to Access Admin Dashboard

### First Time Setup
1. Click the **Settings ⚙️ icon** in the top right corner of the website
2. Click **"Need an account? Sign up"**
3. Enter your details:
   - Name
   - Email
   - Password (minimum 6 characters)
4. Click **"Create Account"**
5. You'll be automatically logged in

### Logging In
1. Click the **Settings ⚙️ icon**
2. Enter your email and password
3. Click **"Login"**

## Using the Dashboard

### Viewing Analytics
1. Go to the **Overview** tab
2. See summary cards with total and active subscribers
3. Review the bar chart for monthly signups
4. Check the line chart for cumulative growth
5. Click **"Refresh"** to update data

### Managing Subscribers
1. Go to the **Subscribers** tab
2. Use the search bar to find specific subscribers
3. Filter by language using the dropdown
4. Click **Export CSV** to download the full list
5. Click the trash icon (🗑️) to delete a subscriber

### Sending Individual Emails
1. Go to the **Send Email** tab
2. Select recipients from the right panel:
   - Click individual subscribers
   - Use "Select All" for all subscribers
   - Filter by language before selecting
3. Enter email subject
4. Write your message
5. Click **"Send Email to X Recipients"**

### Managing Newsletters
1. Go to the **Newsletters** tab
2. Click **"Create Newsletter"**
3. Fill in:
   - Subject
   - Language Target (All/English/Arabic)
   - Content
4. Click **"Create Newsletter"**
5. To send: Click **"Send Now"** on the newsletter card
6. Confirm the action
7. View sent status and recipient count

## Important Notes

### Email Sending
⚠️ **Currently, emails are simulated**. The system logs email actions but doesn't actually send emails. For production:
- Integrate an email service like SendGrid, Mailgun, or AWS SES
- Add API keys for the email service
- Update the backend to use the email service API

### Data Storage
- All subscriber data is stored in Supabase
- Data persists between sessions
- Monthly statistics are automatically calculated

### Security
- Admin access requires authentication
- All admin routes are protected
- Access tokens expire after the session

### Language Support
- Subscribers can sign up in English or Arabic
- Filter and target emails by language
- Newsletters can be sent to specific language groups

## Tips

1. **Export Regularly**: Download CSV backups of your subscriber list
2. **Test First**: When sending newsletters, start with a small test group
3. **Monitor Growth**: Check the monthly stats to see signup trends
4. **Clean Lists**: Remove inactive or bounced emails regularly
5. **Segment by Language**: Use language filters to send targeted content

## Support

For technical issues or questions, check the browser console for error logs.

---

**Built with**: React, TypeScript, Supabase, Tailwind CSS, Recharts
