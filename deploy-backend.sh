#!/bin/bash

# Cloudflare Backend Deployment Script
# This script deploys the backend API to Cloudflare Workers with D1 database

set -e

echo "🚀 Starting Cloudflare Backend Deployment..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Install it with: npm install -g wrangler"
    exit 1
fi

# Check if logged in to Cloudflare
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Run: wrangler login"
    exit 1
fi

echo "✅ Authenticated with Cloudflare"
echo ""

# Step 1: Create D1 Database
echo "📦 Step 1: Creating D1 Database..."
if wrangler d1 info newsletter-db &> /dev/null; then
    echo "✅ Database 'newsletter-db' already exists"
else
    echo "Creating new database..."
    wrangler d1 create newsletter-db
    echo "✅ Database created"
fi
echo ""

# Step 2: Initialize Database Schema
echo "🗄️  Step 2: Initializing Database Schema..."
wrangler d1 execute newsletter-db --file schema.sql
echo "✅ Schema initialized"
echo ""

# Step 3: Set Secrets
echo "🔑 Step 3: Setting Secrets..."
echo "Setting EMAIL_PASSWORD..."
wrangler secret put EMAIL_PASSWORD --env production
echo "✅ EMAIL_PASSWORD set"

echo ""
echo "Setting RESEND_API_KEY (optional - press Enter to skip)..."
read -p "Enter RESEND_API_KEY (or press Enter to skip): " resend_key
if [ ! -z "$resend_key" ]; then
    echo "$resend_key" | wrangler secret put RESEND_API_KEY --env production
    echo "✅ RESEND_API_KEY set"
else
    echo "⏭️  Skipped RESEND_API_KEY"
fi
echo ""

# Step 4: Deploy Backend
echo "🚀 Step 4: Deploying Backend to Cloudflare Workers..."
wrangler deploy --env production
echo "✅ Backend deployed!"
echo ""

# Step 5: Get deployment info
echo "📋 Deployment Information:"
echo "================================"
wrangler deployments list
echo ""

echo "✅ Backend deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update API URL in src/utils/api.ts"
echo "2. Rebuild frontend: npm run build"
echo "3. Deploy frontend: wrangler pages deploy dist"
echo "4. Test API endpoints"
echo ""
echo "🎉 Your application is now fully deployed on Cloudflare!"
