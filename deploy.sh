#!/bin/bash

# Cloudflare Pages Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting Cloudflare Pages Deployment..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

echo "✅ Wrangler CLI found"
echo ""

# Check if authenticated
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not authenticated. Running login..."
    wrangler login
fi

echo "✅ Authenticated with Cloudflare"
echo ""

# Build the app
echo "🔨 Building the app..."
npm run build
echo "✅ Build complete"
echo ""

# Check if database exists
echo "📦 Checking D1 database..."
if ! wrangler d1 info newsletter-db &> /dev/null; then
    echo "⚠️  Database not found. Creating..."
    wrangler d1 create newsletter-db
    echo "✅ Database created"
    echo ""
    echo "📝 Initializing database schema..."
    wrangler d1 execute newsletter-db --file schema.sql
    echo "✅ Schema initialized"
else
    echo "✅ Database found"
fi

echo ""

# Check environment variables
echo "🔑 Checking environment variables..."
if ! wrangler secret list | grep -q "RESEND_API_KEY"; then
    echo "⚠️  RESEND_API_KEY not set. Setting now..."
    read -p "Enter your Resend API key: " resend_key
    echo "$resend_key" | wrangler secret put RESEND_API_KEY
fi

if ! wrangler secret list | grep -q "FROM_EMAIL"; then
    echo "⚠️  FROM_EMAIL not set. Setting now..."
    read -p "Enter your FROM_EMAIL: " from_email
    echo "$from_email" | wrangler secret put FROM_EMAIL
fi

echo "✅ Environment variables configured"
echo ""

# Deploy
echo "🚀 Deploying to Cloudflare..."
wrangler deploy
echo "✅ Deployment complete!"
echo ""

# Get deployment URL
echo "📍 Your app is now live at:"
echo "   https://your-project.pages.dev"
echo ""

echo "✅ Deployment successful! 🎉"
echo ""
echo "Next steps:"
echo "1. Verify your domain in Resend: https://app.resend.com/domains"
echo "2. Test your API: curl https://your-project.pages.dev/make-server-53bed28f/health"
echo "3. Access admin dashboard: https://your-project.pages.dev/admin"
