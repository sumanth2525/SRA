# How to Get Your Supabase Credentials

Follow these steps to get your Supabase URL and API keys:

## Step 1: Log in to Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account (or create one if you don't have it)

## Step 2: Create or Select Your Project

1. If you don't have a project yet:
   - Click **"New Project"** button
   - Enter a project name (e.g., "Productivity Tracker")
   - Enter a database password (save this password!)
   - Select a region closest to you
   - Click **"Create new project"**
   - Wait 2-3 minutes for the project to be set up

2. If you already have a project:
   - Click on your project from the dashboard

## Step 3: Get Your API Credentials

1. In your project dashboard, look at the **left sidebar**
2. Click on **"Settings"** (gear icon at the bottom)
3. Click on **"API"** in the settings menu

## Step 4: Copy Your Credentials

You'll see a page with several sections. Here's what you need:

### 📍 Project URL
- Look for **"Project URL"** section
- Copy the URL (it looks like: `https://xxxxxxxxxxxxx.supabase.co`)
- This is your `SUPABASE_URL`

### 🔑 API Keys
- Look for **"Project API keys"** section
- You'll see two keys:

#### 1. **anon/public key** (for frontend)
- This is the **"anon public"** key
- It's safe to use in frontend code
- This is your `VITE_SUPABASE_ANON_KEY` (frontend) and `SUPABASE_KEY` (backend)

#### 2. **service_role key** (for backend - KEEP SECRET!)
- This is the **"service_role secret"** key
- ⚠️ **IMPORTANT**: This key has admin access - NEVER expose it in frontend code!
- Click the **"Reveal"** button to see it
- This is your `SUPABASE_SERVICE_KEY`

## Step 5: Create Your .env Files

### Frontend .env file (in root directory)
Create a file named `.env` with:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Backend .env file (in backend directory)
Create a file named `.env` in the `backend` folder with:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## Visual Guide

```
Supabase Dashboard
├── Settings (gear icon)
    └── API
        ├── Project URL → Copy this
        └── Project API keys
            ├── anon public → Copy this (for frontend)
            └── service_role → Copy this (for backend - click Reveal)
```

## Example

Your credentials will look something like this:

**Project URL:**
```
https://abcdefghijklmnop.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.example
```

**service_role key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjgwLCJleHAiOjE5NTQ1NDMyODB9.example
```

## ⚠️ Important Security Notes

1. **Never commit .env files to Git** - They're already in `.gitignore`
2. **Never share your service_role key** - It has full database access
3. **The anon key is safe** for frontend use - it's restricted by Row Level Security (RLS)
4. **Keep your .env files local** - Don't upload them anywhere public

## Quick Checklist

- [ ] Logged into Supabase
- [ ] Created/selected a project
- [ ] Went to Settings → API
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Copied service_role key (clicked Reveal)
- [ ] Created `.env` file in root directory
- [ ] Created `backend/.env` file
- [ ] Pasted credentials into both files
- [ ] Saved both files

## Need Help?

If you can't find these settings:
1. Make sure you're logged into the correct Supabase account
2. Make sure you've selected the correct project
3. The API settings are always in: **Settings → API** (left sidebar)

