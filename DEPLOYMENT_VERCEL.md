# Vercel Deployment Guide for YaadNama

## ✅ Pre-Deployment Checklist

Before deploying to Vercel, ensure you have:

- [ ] GitHub account (https://github.com)
- [ ] Vercel account (https://vercel.com)
- [ ] Groq API Key (https://console.groq.com/keys)
- [ ] Code pushed to GitHub repository
- [ ] `.env.example` file in root (already created)

---

## 📋 Step 1: Prepare Your Code for Deployment

### 1.1 Ensure `.gitignore` is correct

Make sure your `.gitignore` includes:
```
.env.local
.env.*.local
node_modules/
.next/
```

**Check:** Run this to verify `.env.local` is NOT committed to git:
```bash
git status
```

You should NOT see `.env.local` in the output.

### 1.2 Verify `.env.example` exists

```bash
ls .env.example
```

This file helps other developers know what environment variables they need.

### 1.3 Test build locally

Make sure the app builds correctly:
```bash
npm run build
npm start
```

Should start successfully on `http://localhost:3000`

---

## 🚀 Step 2: Push Code to GitHub

### 2.1 If this is your first push to GitHub

```bash
# Check if git is initialized
git status

# Add all files
git add .

# Commit
git commit -m "YaadNama - AI Memory Companion ready for deployment"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/yaadnama.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.2 If you've already pushed to GitHub

```bash
git add .
git commit -m "YaadNama updated - ready for Vercel"
git push origin main
```

✅ Verify: Visit your GitHub repo URL to confirm code is there

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Sign in to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Sign In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 3.2 Create a New Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your **`yaadnama`** repository
3. Click **"Import"**

### 3.3 Configure Build Settings

Vercel should auto-detect Next.js. Verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | ./ (or empty) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |

These are usually pre-filled correctly. Click **"Continue"** if they look good.

### 3.4 Add Environment Variables ⚠️ IMPORTANT

On the "Environment Variables" page, add:

```
GROQ_API_KEY = your_actual_groq_api_key_here
```

**Optional (for production auth):**
```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
```

⚠️ **DO NOT paste your real keys into `.env.local` and commit them to GitHub**
- Only put them here in Vercel's Environment Variables section
- `.env.local` is in `.gitignore` so it won't upload

### 3.5 Deploy

Click **"Deploy"** button and wait for the build to complete.

You'll see:
```
✓ Deployed successfully!
```

Your app will be available at a URL like:
```
https://yaadnama-xyz123.vercel.app
```

---

## 🧪 Step 4: Test Your Deployment

1. Open your Vercel URL
2. Test key features:
   - ✅ Create account (try with demo email)
   - ✅ Sign in
   - ✅ Add a memory
   - ✅ Check AI companion responds
   - ✅ Log a mood
   - ✅ Try guest mood tracking at `/mood/guest`

### 🐛 If something breaks

Check the Vercel deployment logs:
1. Go to your project on Vercel
2. Click **"Deployments"**
3. Click the failed deployment
4. View **"Build Logs"** or **"Runtime Logs"**

Common issues:
- **"GROQ_API_KEY not defined"** → Check env variables were added
- **Build fails** → Run `npm run build` locally to debug

---

## 🔄 Step 5: Update Your Deployment (After Making Changes)

Every time you push to GitHub, Vercel auto-deploys:

```bash
# Make changes to your code
git add .
git commit -m "Fixed feature X"
git push origin main
```

Vercel automatically rebuilds and deploys. You can watch progress in the Vercel dashboard.

---

## 📊 Monitoring Your Deployment

### View Analytics
- Go to your Vercel project dashboard
- Check **"Analytics"** tab for page views, response times
- Check **"Functions"** for API route performance

### View Logs
- **Build logs** → see compilation errors
- **Runtime logs** → see server errors while live
- **Function logs** → see `/api/ai` responses

---

## 🔐 Security Best Practices

✅ Do:
- Store API keys ONLY in Vercel Environment Variables
- Never commit `.env.local` to GitHub
- Use `NEXT_PUBLIC_*` prefix for keys that need to be in browser (Supabase anon key is safe)

❌ Don't:
- Paste real API keys into your code
- Commit `.env.local` to GitHub
- Share your Groq API key publicly

---

## 🆘 Troubleshooting Deployment

| Problem | Solution |
|---------|----------|
| **Deployment stuck on "Building"** | Wait a few minutes. If it fails, check build logs. |
| **"Cannot find module" error** | Run `npm install` locally and commit `package-lock.json` |
| **Environment variable undefined** | Verify it was added to Vercel Environment Variables section |
| **App loads but AI doesn't respond** | Check GROQ_API_KEY is correct in Vercel env vars |
| **"Demo mode" showing in production** | Change `lib/demo.js` to `export const DEMO_MODE = false;` and redeploy |

---

## 🎉 You're Live!

Your URL is: `https://yaadnama-YOUR_PROJECT.vercel.app`

Share this link with testers, family, or the internet! 

The app is now live and will auto-update whenever you push to GitHub.

---

## 📚 Helpful Links

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment/vercel
- Groq API: https://console.groq.com
- Supabase: https://supabase.com
