# Vercel Deployment Guide

## ✅ Fix "Error adding food entry" in Vercel

The error occurs because **environment variables are not set in Vercel**. Here's how to fix it:

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`sra-alpha`)
3. Click on **"Settings"** tab
4. Click on **"Environment Variables"** in the left sidebar
5. Add these two variables:

#### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** Your Supabase project URL (e.g., `https://mpddyxoaaodzzwqxdvba.supabase.co`)
- **Environment:** Production, Preview, Development (select all)

#### Variable 2:
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Your Supabase publishable key (starts with `sb_publishable_...`)
- **Environment:** Production, Preview, Development (select all)

### Step 2: Redeploy

After adding the environment variables:

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on your latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic redeploy

### Step 3: Verify

After redeployment, try adding a food entry again. It should work!

## 🔍 How to Find Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to **Settings** → **API Keys**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Publishable key** → `VITE_SUPABASE_ANON_KEY`

## ⚠️ Common Issues

### Issue 1: Still Getting Errors After Adding Variables
- Make sure you selected **all environments** (Production, Preview, Development)
- Wait for the redeploy to complete
- Clear browser cache and try again

### Issue 2: RLS (Row Level Security) Errors
- Go to Supabase → SQL Editor
- Make sure you ran `supabase_schema.sql` to create the tables and policies
- Check that the policies allow INSERT operations

### Issue 3: CORS Errors
- Supabase should handle CORS automatically
- If issues persist, check Supabase project settings

## 📝 Quick Checklist

- [ ] Added `VITE_SUPABASE_URL` in Vercel
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed the application
- [ ] Tested adding a food entry

## 🎯 After Fixing

Once environment variables are set, all features should work:
- ✅ Add food entries
- ✅ Add expenses
- ✅ Create notes and reminders
- ✅ Track investments
- ✅ Store passwords

