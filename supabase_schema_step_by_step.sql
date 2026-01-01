-- ============================================
-- STEP 1: Create Tables
-- ============================================
-- Run this section first

CREATE TABLE IF NOT EXISTS food_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    protein DECIMAL(10, 2) NOT NULL,
    calories DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_payment BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    current_value DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passwords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_food_logs_date ON food_logs(date);
CREATE INDEX IF NOT EXISTS idx_expense_logs_date ON expense_logs(date);
CREATE INDEX IF NOT EXISTS idx_expense_logs_category ON expense_logs(category);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(type);
CREATE INDEX IF NOT EXISTS idx_passwords_service ON passwords(service);

-- ============================================
-- STEP 3: Enable Row Level Security
-- ============================================

ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create Policies
-- ============================================

DROP POLICY IF EXISTS "Allow all operations on food_logs" ON food_logs;
CREATE POLICY "Allow all operations on food_logs" ON food_logs
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on expense_logs" ON expense_logs;
CREATE POLICY "Allow all operations on expense_logs" ON expense_logs
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on notes" ON notes;
CREATE POLICY "Allow all operations on notes" ON notes
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on reminders" ON reminders;
CREATE POLICY "Allow all operations on reminders" ON reminders
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on todos" ON todos;
CREATE POLICY "Allow all operations on todos" ON todos
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on investments" ON investments;
CREATE POLICY "Allow all operations on investments" ON investments
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on passwords" ON passwords;
CREATE POLICY "Allow all operations on passwords" ON passwords
    FOR ALL USING (true) WITH CHECK (true);

