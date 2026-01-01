# Quick Setup Guide

Follow these steps to get your Productivity Tracker up and running:

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)
4. Go to **SQL Editor** in the left sidebar
5. Click **New Query**
6. Copy and paste the entire contents of `supabase_schema.sql`
7. Click **Run** to execute the schema
8. Go to **Settings** > **API** to get your credentials:
   - **Project URL** (this is your `SUPABASE_URL`)
   - **anon/public key** (this is your `SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_KEY` - keep this secret!)

## Step 2: Environment Variables

### Frontend (.env)
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Backend (backend/.env)
Create a `backend/.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## Step 3: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
pip install -r requirements.txt
```

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 - Frontend
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 5: Open in Browser

Navigate to `http://localhost:3000` in your browser.

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created both `.env` files
- Check that the variable names are correct (case-sensitive)
- Restart your development servers after creating `.env` files

### "Table doesn't exist" errors
- Make sure you ran the `supabase_schema.sql` file in Supabase SQL Editor
- Check that all tables were created successfully

### CORS errors
- Make sure the backend is running on port 8000
- Check that `backend/main.py` has the correct CORS origins

### Import errors in Python
- Make sure you're in the correct directory when running the backend
- Verify all packages in `requirements.txt` are installed

## Next Steps

1. Start adding your data:
   - Log your first meal in Health
   - Add an expense in Finance
   - Create a note or reminder
   - Track an investment

2. Customize:
   - Adjust protein targets in Health
   - Add more expense categories
   - Customize the dashboard

3. For production:
   - Set up proper authentication
   - Update RLS policies in Supabase
   - Encrypt sensitive data
   - Deploy to production

Enjoy tracking your productivity! 🚀

