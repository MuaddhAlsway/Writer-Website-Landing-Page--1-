# Set Cloudflare Pages Secrets for Production

$projectName = "author-fatima-76r"
$env = "production"

# Turso credentials
$tursoUrl = "libsql://authorfsk-authorfsk.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA"
$tursoToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxOTUxNDYsImlkIjoiMmQ5YTVhMDUtYzMyOS00OGZlLWFhY2MtNTVlYzdiY2Q5YzQyIiwicmlkIjoiZmI2M2I1ZjEtZTgwNi00YjFjLTkzMjMtZDVlMTgwZDZkNDhjIn0.4tqUGYj5USB1UQtj1H9gS2pHfi0u78wIDBMNEGpHUTVz60prPnt1-36Suw5LOYxujUToCnPhvnKATFzVFYQNAA"

# Gmail credentials
$gmailUser = "AuthorFSK@gmail.com"
$gmailPass = "peed qvhs ekmo kisv"

Write-Host "Setting Cloudflare Pages Secrets..." -ForegroundColor Green

# Set Turso URL
Write-Host "Setting TURSO_CONNECTION_URL..." -ForegroundColor Yellow
$tursoUrl | wrangler pages secret put TURSO_CONNECTION_URL --project-name $projectName --env $env

# Set Turso Token
Write-Host "Setting TURSO_AUTH_TOKEN..." -ForegroundColor Yellow
$tursoToken | wrangler pages secret put TURSO_AUTH_TOKEN --project-name $projectName --env $env

# Set Gmail User
Write-Host "Setting GMAIL_USER..." -ForegroundColor Yellow
$gmailUser | wrangler pages secret put GMAIL_USER --project-name $projectName --env $env

# Set Gmail Password
Write-Host "Setting GMAIL_APP_PASSWORD..." -ForegroundColor Yellow
$gmailPass | wrangler pages secret put GMAIL_APP_PASSWORD --project-name $projectName --env $env

Write-Host "✅ All secrets set successfully!" -ForegroundColor Green
Write-Host "Now run: npm run deploy" -ForegroundColor Cyan
