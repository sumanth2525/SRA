# Create Your .env Files

## Step 1: Create backend/.env file

1. Go to the `backend` folder
2. Create a new file named `.env` (no extension)
3. Copy and paste this content, then replace with your actual values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-publishable-key-here
SUPABASE_SERVICE_KEY=your-secret-key-here
```

**Replace:**
- `https://your-project-id.supabase.co` with your actual Project URL from Supabase
- `your-publishable-key-here` with your publishable key (starts with `sb_publishable_...`)
- `your-secret-key-here` with your secret key (starts with `sb_secret_...`)

## Step 2: Create root .env file

1. Go to the root folder (where package.json is)
2. Create a new file named `.env` (no extension)
3. Copy and paste this content, then replace with your actual values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key-here
```

**Replace:**
- `https://your-project-id.supabase.co` with your actual Project URL from Supabase
- `your-publishable-key-here` with your publishable key (starts with `sb_publishable_...`)

## Quick Reference

From Supabase Settings -> API Keys page:
- **Project URL** → Use for `SUPABASE_URL` and `VITE_SUPABASE_URL`
- **Publishable key** → Use for `SUPABASE_KEY` and `VITE_SUPABASE_ANON_KEY`
- **Secret key** → Use for `SUPABASE_SERVICE_KEY` (backend only!)

## After Creating Files

Run the test script:
```bash
python test_supabase_connection.py
```

This will verify your connection is working!

