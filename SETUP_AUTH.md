# YaadNama - Email/Password Authentication Setup

Your app now uses **Supabase** for professional email/password authentication! 

## ✅ What's Changed

- **Register Page**: Now requires email & password
- **Login Page**: Email/password based sign-in
- **Authentication**: Secure backend auth with Supabase
- **User Profile**: Identified by email instead of just name

## 🚀 Setup Steps

### Step 1: Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Your API Keys
1. Go to **Project Settings** → **API**
2. Copy your **Project URL** (Supabase URL)
3. Copy your **anon/public key** (Anon Key)

### Step 3: Add to .env.local
In your project root, open `.env.local` and update:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Enable Email Authentication in Supabase
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it's on by default)
3. Go to **Email Templates** → make sure templates are set

### Step 5: Restart Your Dev Server
```bash
npm run dev
```

## 📝 How Users Sign Up

1. Click "Create Account" on home page
2. Enter email (e.g., user@example.com)
3. Create a password (6+ characters)
4. Confirm password
5. Account created! They're redirected to sign in
6. Sign in with their email and password
7. Access their dashboard and memories

## 🔐 Features

✅ Email/password authentication  
✅ Session management  
✅ Protected routes  
✅ Sign out functionality  
✅ User email displayed in navbar  

## 🎯 Guest Mode Still Works

- Continue as Guest still works without authentication
- Guests can track moods without creating an account
