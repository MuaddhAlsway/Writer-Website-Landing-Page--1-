# Step-by-Step: Connect GitHub to Cloudflare Pages

## STEP 1: Open Cloudflare Dashboard

**Click this link:**
```
https://dash.cloudflare.com
```

**You should see:**
```
Cloudflare Dashboard
├─ Workers & Pages (left sidebar)
├─ Pages
├─ Workers
└─ ...
```

---

## STEP 2: Go to Pages

**Click:** `Workers & Pages` (left sidebar)

**Then click:** `Pages` tab

**You should see:**
```
Pages
├─ Create application (button)
├─ Your existing projects (if any)
└─ ...
```

---

## STEP 3: Create Application

**Click:** `Create application` button

**You should see:**
```
Create application
├─ Connect to Git (option)
├─ Deploy with direct upload (option)
└─ ...
```

---

## STEP 4: Connect to Git

**Click:** `Connect to Git`

**You should see:**
```
Select a Git provider
├─ GitHub (option)
├─ GitLab (option)
└─ ...
```

---

## STEP 5: Select GitHub

**Click:** `GitHub`

**You should see:**
```
Authorize Cloudflare
├─ "Authorize cloudflare" button
└─ GitHub login (if needed)
```

---

## STEP 6: Authorize Cloudflare

**Click:** `Authorize cloudflare` button

**If prompted:**
- Log in to GitHub
- Click `Authorize cloudflare`

**You should see:**
```
Select a repository
├─ Your repositories list
├─ Search box
└─ ...
```

---

## STEP 7: Find Your Repository

**Look for:** `Writer-Website-Landing-Page--1-`

**If you don't see it:**
- Scroll down
- Use search box
- Type: `Writer-Website`

**Click:** Your repository name

---

## STEP 8: Begin Setup

**Click:** `Begin setup` button

**You should see:**
```
Build configuration
├─ Production branch: main
├─ Build command: npm run build
├─ Build output directory: dist
└─ ...
```

---

## STEP 9: Verify Build Settings

**Check these are correct:**
- ✅ Production branch: `main`
- ✅ Build command: `npm run build`
- ✅ Build output directory: `dist`

**If correct:** Click `Save and Deploy`

**If wrong:** Update them first, then click `Save and Deploy`

---

## STEP 10: Wait for Deployment

**You should see:**
```
Deployment in progress...
├─ Building... 🔨
├─ Deploying... 📦
└─ Success! ✅
```

**⏳ Wait 2-3 minutes**

---

## STEP 11: Get Your URL

**Once deployed, you'll see:**
```
Deployment successful!
├─ URL: https://author-fatima-76r-eis.pages.dev
├─ Status: ✅ Active
└─ ...
```

**Copy this URL!**

---

## STEP 12: Test Your Site

**Open in browser:**
```
https://author-fatima-76r-eis.pages.dev
```

**You should see:**
- Your website loads ✅
- Admin login works ✅
- No errors ✅

---

## STEP 13: Check Deployments

**Go to:**
```
Cloudflare Dashboard
→ Pages
→ author-fatima-76r
→ Deployments tab
```

**You should see:**
```
Deployments
├─ Latest deployment: ✅ Success
├─ Build time: 2-3 minutes
├─ URL: https://author-fatima-76r-eis.pages.dev
└─ ...
```

---

## STEP 14: Test Auto-Deploy

**Make a small change:**
```bash
# Edit any file
echo "// test" >> src/main.tsx

# Commit and push
git add .
git commit -m "test auto-deploy"
git push origin main
```

**Check Cloudflare:**
```
Deployments tab
├─ New deployment should appear
├─ Status: Building...
├─ Wait 2-3 minutes
└─ Status: ✅ Success
```

**Visit your domain:**
```
https://author-fatima-76r-eis.pages.dev
```

**Changes should be live!** ✅

---

## STEP 15: Add Custom Domain (Optional)

**Once GitHub is connected:**

1. Go to Cloudflare Dashboard
2. **Pages** → **author-fatima-76r**
3. Click **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter your domain
6. Follow nameserver instructions

---

## Checklist

- [ ] Opened https://dash.cloudflare.com
- [ ] Clicked Workers & Pages → Pages
- [ ] Clicked Create application
- [ ] Clicked Connect to Git → GitHub
- [ ] Authorized Cloudflare
- [ ] Selected your repository
- [ ] Clicked Begin setup
- [ ] Verified build settings
- [ ] Clicked Save and Deploy
- [ ] Waited 2-3 minutes
- [ ] Got your URL
- [ ] Tested your site
- [ ] Checked Deployments tab
- [ ] Tested auto-deploy
- [ ] ✅ Connected!

---

## Your URL

```
https://author-fatima-76r-eis.pages.dev
```

**This is your live site!**

---

## What's Next?

1. ✅ GitHub connected
2. ⏭️ Add custom domain (optional)
3. ⏭️ Start pushing changes
4. ⏭️ Watch auto-deploy work

---

## Need Help?

- **Stuck on a step?** Go back and re-read that step
- **Error message?** Check DEPLOYMENT_AND_TESTING.md
- **Want details?** Check GITHUB_CLOUDFLARE_SETUP.md

---

## You're Done! 🎉

Your GitHub repository is now connected to Cloudflare Pages!

Every push to GitHub automatically updates your live site within 2-3 minutes.

**Start pushing changes and watch them go live!** 🚀
