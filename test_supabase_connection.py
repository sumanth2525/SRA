"""
Test Supabase Connection
This script tests if your Supabase credentials are working correctly.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
    print("[OK] Loaded backend/.env file")
else:
    print("[ERROR] backend/.env file not found!")
    print("Please create backend/.env with your Supabase credentials")
    sys.exit(1)

# Get environment variables
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase_service_key = os.environ.get("SUPABASE_SERVICE_KEY")

print("\n" + "="*50)
print("Testing Supabase Connection")
print("="*50)

# Check if variables are set
print("\n[INFO] Checking environment variables...")
if supabase_url:
    print(f"[OK] SUPABASE_URL: {supabase_url[:30]}...")
else:
    print("[ERROR] SUPABASE_URL: Not set")
    
if supabase_key:
    print(f"[OK] SUPABASE_KEY: {supabase_key[:30]}...")
else:
    print("[ERROR] SUPABASE_KEY: Not set")
    
if supabase_service_key:
    print(f"[OK] SUPABASE_SERVICE_KEY: {supabase_service_key[:30]}...")
else:
    print("[ERROR] SUPABASE_SERVICE_KEY: Not set")

if not all([supabase_url, supabase_key, supabase_service_key]):
    print("\n[ERROR] Missing required environment variables!")
    print("Please check your backend/.env file")
    sys.exit(1)

# Test connection
print("\n[INFO] Testing connection to Supabase...")
try:
    from supabase import create_client
    
    # Test with service role key (backend)
    supabase = create_client(supabase_url, supabase_service_key)
    
    # Try to query a table (this will fail if tables don't exist, but connection will work)
    print("   Attempting to connect...")
    
    # Test connection by trying to list tables or make a simple query
    # We'll try to query food_logs table (even if empty, connection should work)
    try:
        response = supabase.table('food_logs').select('id').limit(1).execute()
        print("   [OK] Successfully connected to Supabase!")
        print(f"   [OK] Can access 'food_logs' table")
    except Exception as e:
        error_msg = str(e)
        if "relation" in error_msg.lower() or "does not exist" in error_msg.lower():
            print("   [OK] Successfully connected to Supabase!")
            print("   [WARNING] Tables don't exist yet - you need to run the SQL schema")
            print("   [INFO] Run supabase_schema.sql in Supabase SQL Editor")
        else:
            print(f"   [ERROR] Connection error: {error_msg}")
            raise
    
    # Test with anon key (frontend)
    print("\n[INFO] Testing with anon key (frontend)...")
    supabase_anon = create_client(supabase_url, supabase_key)
    try:
        response = supabase_anon.table('food_logs').select('id').limit(1).execute()
        print("   [OK] Anon key works correctly!")
    except Exception as e:
        error_msg = str(e)
        if "relation" in error_msg.lower() or "does not exist" in error_msg.lower():
            print("   [OK] Anon key works correctly!")
            print("   [WARNING] Tables don't exist yet - you need to run the SQL schema")
        else:
            print(f"   [WARNING] Anon key test: {error_msg}")
    
    print("\n" + "="*50)
    print("[SUCCESS] CONNECTION TEST PASSED!")
    print("="*50)
    print("\n[INFO] Next steps:")
    print("   1. Make sure you've run supabase_schema.sql in Supabase SQL Editor")
    print("   2. Create frontend .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY")
    print("   3. Start your backend: cd backend && python main.py")
    print("   4. Start your frontend: npm run dev")
    
except ImportError:
    print("[ERROR] Supabase Python library not installed!")
    print("   Run: pip install supabase")
    sys.exit(1)
except Exception as e:
    print(f"\n[ERROR] CONNECTION TEST FAILED!")
    print(f"   Error: {str(e)}")
    print("\n[INFO] Troubleshooting:")
    print("   1. Check that your SUPABASE_URL is correct")
    print("   2. Check that your SUPABASE_SERVICE_KEY is correct")
    print("   3. Make sure your Supabase project is active")
    print("   4. Check your internet connection")
    sys.exit(1)

