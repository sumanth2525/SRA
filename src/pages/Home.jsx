import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Activity, DollarSign, FileText, TrendingUp, Lock, Target, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [stats, setStats] = useState({
    protein: { current: 0, target: 150 },
    expenses: { today: 0, month: 0 },
    todos: { total: 0, completed: 0 },
    investments: { total: 0, gain: 0 },
    reminders: { upcoming: 0 }
  })

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Load protein stats
      const { data: foodData } = await supabase
        .from('food_logs')
        .select('protein')
        .gte('date', new Date().toISOString().split('T')[0])

      const proteinTotal = (foodData || []).reduce((sum, entry) => sum + (entry.protein || 0), 0)

      // Load expense stats
      const today = new Date().toISOString().split('T')[0]
      const { data: todayExpenses } = await supabase
        .from('expense_logs')
        .select('amount')
        .eq('date', today)

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const { data: monthExpenses } = await supabase
        .from('expense_logs')
        .select('amount')

      const todayTotal = (todayExpenses || []).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
      const monthData = (monthExpenses || []).filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })
      const monthTotal = monthData.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

      // Load todo stats
      const { data: todos } = await supabase
        .from('todos')
        .select('completed')

      const completedTodos = (todos || []).filter(t => t.completed).length

      // Load investment stats
      const { data: investments } = await supabase
        .from('investments')
        .select('amount, current_value')

      const totalInvested = (investments || []).reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0)
      const totalCurrent = (investments || []).reduce((sum, inv) => sum + (parseFloat(inv.current_value) || parseFloat(inv.amount) || 0), 0)
      const totalGain = totalCurrent - totalInvested

      // Load reminders
      const { data: reminders } = await supabase
        .from('reminders')
        .select('due_date')
        .gte('due_date', new Date().toISOString())

      setStats({
        protein: { current: proteinTotal, target: 150 },
        expenses: { today: todayTotal, month: monthTotal },
        todos: { total: (todos || []).length, completed: completedTodos },
        investments: { total: totalInvested, gain: totalGain },
        reminders: { upcoming: (reminders || []).length }
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const proteinPercentage = (stats.protein.current / stats.protein.target) * 100
  const todoPercentage = stats.todos.total > 0 ? (stats.todos.completed / stats.todos.total) * 100 : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 sm:p-8 rounded-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-white/90 text-base sm:text-lg">Here's your productivity overview</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Health Card */}
        <Link to="/health" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-500" />
            <span className="text-sm text-gray-500">Health</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {stats.protein.current}g
          </h3>
          <p className="text-sm text-gray-600">of {stats.protein.target}g protein</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
            />
          </div>
        </Link>

        {/* Finance Card */}
        <Link to="/finance" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-sm text-gray-500">Finance</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            ${stats.expenses.today.toFixed(2)}
          </h3>
          <p className="text-sm text-gray-600">spent today</p>
          <p className="text-xs text-gray-500 mt-2">
            ${stats.expenses.month.toFixed(2)} this month
          </p>
        </Link>

        {/* Todos Card */}
        <Link to="/notes" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-sm text-gray-500">Tasks</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {stats.todos.completed}/{stats.todos.total}
          </h3>
          <p className="text-sm text-gray-600">tasks completed</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${todoPercentage}%` }}
            />
          </div>
        </Link>

        {/* Investments Card */}
        <Link to="/investments" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-sm text-gray-500">Investments</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            ${stats.investments.total.toFixed(2)}
          </h3>
          <p className={`text-sm font-semibold ${stats.investments.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.investments.gain >= 0 ? '+' : ''}${stats.investments.gain.toFixed(2)}
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
            <Link to="/finance" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <RecentExpenses />
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Reminders</h2>
            <Link to="/notes" className="text-sm text-purple-600 hover:underline">
              View all
            </Link>
          </div>
          <UpcomingReminders />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/health"
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Activity className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">Add Meal</span>
          </Link>
          <Link
            to="/finance"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Add Expense</span>
          </Link>
          <Link
            to="/notes"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Add Note</span>
          </Link>
          <Link
            to="/passwords"
            className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Lock className="w-6 h-6 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-indigo-700">Add Password</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function RecentExpenses() {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    loadRecentExpenses()
  }, [])

  const loadRecentExpenses = async () => {
    try {
      const { data } = await supabase
        .from('expense_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(5)

      setExpenses(data || [])
    } catch (error) {
      console.error('Error loading expenses:', error)
    }
  }

  if (expenses.length === 0) {
    return <p className="text-gray-500 text-sm">No recent expenses</p>
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium text-gray-800">{expense.description}</p>
            <p className="text-gray-500">{expense.category}</p>
          </div>
          <p className="font-semibold text-red-600">${parseFloat(expense.amount).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

function UpcomingReminders() {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    try {
      const { data } = await supabase
        .from('reminders')
        .select('*')
        .gte('due_date', new Date().toISOString())
        .order('due_date', { ascending: true })
        .limit(5)

      setReminders(data || [])
    } catch (error) {
      console.error('Error loading reminders:', error)
    }
  }

  if (reminders.length === 0) {
    return <p className="text-gray-500 text-sm">No upcoming reminders</p>
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="flex items-start gap-2 text-sm">
          <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-gray-800">{reminder.title}</p>
            <p className="text-gray-500">
              {new Date(reminder.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

