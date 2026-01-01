from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load .env file from the backend directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise ValueError("Missing Supabase environment variables")

supabase: Client = create_client(url, key)

