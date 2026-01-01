# Environment Variables Setup

## ✅ What You've Done
You've shared your service role key: `sb_secret_3uMPbHJx8bZVF7FX0dTxcg_Olo4gPJa`

## 📋 What You Still Need

Go back to the Supabase **API Keys** page and copy:

1. **Project URL** 
   - Look for "Project URL" section
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL

2. **anon public key**
   - Look for "Project API keys" section
   - Find the **"anon public"** key (NOT the service_role)
   - It's a long string starting with `eyJ...`
   - Copy this entire key

## 📝 Update Your .env Files

### 1. Root directory `.env` file
Open `.env` in the root directory and replace:
- `https://your-project-id.supabase.co` with your actual Project URL
- `your-anon-key-here` with your anon public key

### 2. Backend `.env` file  
Open `backend/.env` and replace:
- `https://your-project-id.supabase.co` with your actual Project URL
- `your-anon-key-here` with your anon public key
- The service role key is already filled in ✅

## 🔍 How to Find the anon Key

On the API Keys page, you'll see:
- **anon public** ← This is what you need (safe for frontend)
- **service_role** ← You already have this one ✅

The anon key is usually visible without clicking "Reveal", while service_role requires clicking "Reveal".

## ⚠️ Important
- The service role key you shared should ONLY be in `backend/.env`
- NEVER put the service role key in the frontend `.env` file
- The anon key is safe for both frontend and backend

