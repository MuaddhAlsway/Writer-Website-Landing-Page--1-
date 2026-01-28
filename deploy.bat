@echo off
REM Cloudflare Pages Deployment Script for Windows

echo.
echo 🚀 Starting Cloudflare Pages Deployment...
echo.

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Wrangler CLI not found. Installing...
    call npm install -g wrangler
)

echo ✅ Wrangler CLI found
echo.

REM Check if authenticated
echo 🔐 Checking Cloudflare authentication...
wrangler whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Not authenticated. Running login...
    call wrangler login
)

echo ✅ Authenticated with Cloudflare
echo.

REM Build the app
echo 🔨 Building the app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build complete
echo.

REM Check if database exists
echo 📦 Checking D1 database...
wrangler d1 info newsletter-db >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Database not found. Creating...
    call wrangler d1 create newsletter-db
    echo ✅ Database created
    echo.
    echo 📝 Initializing database schema...
    call wrangler d1 execute newsletter-db --file schema.sql
    echo ✅ Schema initialized
) else (
    echo ✅ Database found
)

echo.

REM Check environment variables
echo 🔑 Checking environment variables...
wrangler secret list | findstr "RESEND_API_KEY" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  RESEND_API_KEY not set. Setting now...
    set /p resend_key="Enter your Resend API key: "
    echo %resend_key% | wrangler secret put RESEND_API_KEY
)

wrangler secret list | findstr "FROM_EMAIL" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  FROM_EMAIL not set. Setting now...
    set /p from_email="Enter your FROM_EMAIL: "
    echo %from_email% | wrangler secret put FROM_EMAIL
)

echo ✅ Environment variables configured
echo.

REM Deploy
echo 🚀 Deploying to Cloudflare...
call wrangler deploy
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deployment failed
    exit /b 1
)
echo ✅ Deployment complete!
echo.

REM Get deployment URL
echo 📍 Your app is now live at:
echo    https://your-project.pages.dev
echo.

echo ✅ Deployment successful! 🎉
echo.
echo Next steps:
echo 1. Verify your domain in Resend: https://app.resend.com/domains
echo 2. Test your API: curl https://your-project.pages.dev/make-server-53bed28f/health
echo 3. Access admin dashboard: https://your-project.pages.dev/admin
echo.

pause
