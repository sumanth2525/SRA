# Productivity Tracker

A comprehensive personal productivity and tracking application built with React and Python FastAPI, using Supabase as the database.

## Features

### 🏥 Health Tracking
- Track protein intake and calories
- Food logging with daily summaries
- Visual progress indicators
- Target-based tracking for muscle growth and weight gain

### 💰 Finance Tracker
- Expense logging with categories
- Daily, weekly, and monthly analytics
- Spending trends and category breakdowns
- Visual charts and graphs

### 📝 Notes & Reminders
- Create and manage notes
- Set reminders with due dates
- Payment reminders
- To-do list with completion tracking

### 📈 Investments
- Track investment portfolio
- Monitor gains/losses
- Portfolio distribution visualization
- Performance metrics

### 🔒 Password Manager
- Secure password storage
- Search functionality
- Password visibility toggle
- Service/website organization

### 🏠 Dashboard
- Overview of all segments
- Quick stats and insights
- Recent activity summaries
- Quick action buttons

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Year_2026_Merged_Web\ App
```

### 2. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the `supabase_schema.sql` file
3. Get your Supabase URL and anon key from Project Settings > API

### 3. Configure Environment Variables

#### Frontend (.env)
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Backend (backend/.env)
Create a `backend/.env` file:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
```

### 4. Install Frontend Dependencies

```bash
npm install
```

### 5. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 6. Run the Application

#### Start the Backend Server

```bash
cd backend
python main.py
```

The backend will run on `http://localhost:8000`

#### Start the Frontend Development Server

In a new terminal:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI application
│   ├── supabase_client.py   # Supabase client setup
│   └── .env                 # Backend environment variables
├── src/
│   ├── components/          # Reusable components
│   │   └── Layout.jsx       # Main layout with navigation
│   ├── lib/
│   │   └── supabase.js      # Supabase client for frontend
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Dashboard
│   │   ├── Health.jsx       # Health tracking
│   │   ├── Finance.jsx      # Finance tracking
│   │   ├── Notes.jsx        # Notes & reminders
│   │   ├── Investments.jsx  # Investment tracking
│   │   └── Passwords.jsx    # Password manager
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── supabase_schema.sql      # Database schema
├── package.json             # Frontend dependencies
├── requirements.txt         # Backend dependencies
└── README.md                # This file
```

## Database Schema

The application uses the following main tables:

- `food_logs` - Food and nutrition tracking
- `expense_logs` - Financial transactions
- `notes` - User notes
- `reminders` - Reminders and payment reminders
- `todos` - To-do list items
- `investments` - Investment portfolio
- `passwords` - Password storage

See `supabase_schema.sql` for the complete schema.

## Usage

1. **Health Tracking**: Navigate to Health section to log meals and track protein intake
2. **Finance**: Add expenses in the Finance section and view analytics
3. **Notes**: Create notes, set reminders, and manage your to-do list
4. **Investments**: Track your investment portfolio and monitor performance
5. **Passwords**: Securely store and manage your passwords
6. **Dashboard**: View an overview of all your data on the home page

## Security Notes

- The current RLS policies allow all operations. For production, you should:
  - Add user authentication
  - Implement user-specific row-level security policies
  - Encrypt sensitive data (especially passwords)
  - Use environment variables for all secrets

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routes in `src/App.jsx`
4. Add corresponding database tables in Supabase
5. Update the schema file if needed

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

This project is for personal use.

## Support

For issues or questions, please check the Supabase documentation or create an issue in the repository.

