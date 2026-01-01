from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime, date
from typing import Optional
import os
import sys

# Add backend directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from supabase_client import supabase
except ImportError:
    # Fallback if supabase_client is not available
    supabase = None

load_dotenv()

app = FastAPI(title="Productivity Tracker API")

# CORS middleware - Allow access from local network
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://10.0.0.89:3000", "*"],  # Allow mobile access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Productivity Tracker API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Health/Food endpoints
@app.get("/api/food-logs")
async def get_food_logs(start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Get food logs, optionally filtered by date range"""
    try:
        query = supabase.table("food_logs").select("*")
        
        if start_date:
            query = query.gte("date", start_date)
        if end_date:
            query = query.lte("date", end_date)
        
        response = query.order("date", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Finance endpoints
@app.get("/api/expenses")
async def get_expenses(start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Get expenses, optionally filtered by date range"""
    try:
        query = supabase.table("expense_logs").select("*")
        
        if start_date:
            query = query.gte("date", start_date)
        if end_date:
            query = query.lte("date", end_date)
        
        response = query.order("date", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/expenses/stats")
async def get_expense_stats(period: str = "month"):
    """Get expense statistics for a given period"""
    try:
        today = date.today()
        
        if period == "day":
            start_date = today.isoformat()
            end_date = today.isoformat()
        elif period == "week":
            from datetime import timedelta
            start_date = (today - timedelta(days=7)).isoformat()
            end_date = today.isoformat()
        else:  # month
            start_date = today.replace(day=1).isoformat()
            end_date = today.isoformat()
        
        response = supabase.table("expense_logs")\
            .select("*")\
            .gte("date", start_date)\
            .lte("date", end_date)\
            .execute()
        
        expenses = response.data
        total = sum(float(e.get("amount", 0)) for e in expenses)
        
        by_category = {}
        for expense in expenses:
            category = expense.get("category", "Other")
            by_category[category] = by_category.get(category, 0) + float(expense.get("amount", 0))
        
        return {
            "total": total,
            "by_category": by_category,
            "count": len(expenses)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dashboard stats endpoint
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get aggregated statistics for the dashboard"""
    try:
        today = date.today().isoformat()
        
        # Protein stats
        food_response = supabase.table("food_logs")\
            .select("protein")\
            .eq("date", today)\
            .execute()
        
        protein_total = sum(float(f.get("protein", 0)) for f in food_response.data)
        
        # Expense stats
        expense_response = supabase.table("expense_logs")\
            .select("amount")\
            .eq("date", today)\
            .execute()
        
        expense_today = sum(float(e.get("amount", 0)) for e in expense_response.data)
        
        # Todo stats
        todo_response = supabase.table("todos")\
            .select("completed")\
            .execute()
        
        todos = todo_response.data
        completed = sum(1 for t in todos if t.get("completed", False))
        
        # Investment stats
        investment_response = supabase.table("investments")\
            .select("amount, current_value")\
            .execute()
        
        investments = investment_response.data
        total_invested = sum(float(i.get("amount", 0)) for i in investments)
        total_value = sum(float(i.get("current_value", i.get("amount", 0))) for i in investments)
        
        return {
            "protein": {"current": protein_total, "target": 150},
            "expenses": {"today": expense_today},
            "todos": {"total": len(todos), "completed": completed},
            "investments": {"total": total_invested, "current_value": total_value, "gain": total_value - total_invested}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

