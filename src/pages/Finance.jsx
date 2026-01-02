import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DollarSign, Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Finance() {
  const [expenses, setExpenses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExpense, setNewExpense] = useState({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
  const [selectedPeriod, setSelectedPeriod] = useState('day')
  const [stats, setStats] = useState({ today: 0, month: 0, byCategory: {} })

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [expenses, selectedPeriod])

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_logs')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error('Error loading expenses:', error)
    }
  }

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayExpenses = expenses.filter(e => e.date === today)
    const todayTotal = todayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    const monthTotal = monthExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

    const byCategory = {}
    const relevantExpenses = selectedPeriod === 'day' ? todayExpenses : monthExpenses
    relevantExpenses.forEach(e => {
      const cat = e.category || 'Other'
      byCategory[cat] = (byCategory[cat] || 0) + (parseFloat(e.amount) || 0)
    })

    setStats({ today: todayTotal, month: monthTotal, byCategory })
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('expense_logs')
        .insert([
          {
            amount: parseFloat(newExpense.amount),
            category: newExpense.category,
            description: newExpense.description,
            date: newExpense.date
          }
        ])

      if (error) throw error

      setNewExpense({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
      setShowAddForm(false)
      loadExpenses()
    } catch (error) {
      console.error('Error adding expense:', error)
      const errorMessage = error?.message || error?.error_description || 'Unknown error occurred'
      alert(`Error adding expense: ${errorMessage}\n\nCheck browser console for details.`)
    }
  }

  const chartData = Object.entries(stats.byCategory).map(([category, amount]) => ({
    category,
    amount: amount.toFixed(2)
  }))

  const lineChartData = expenses
    .filter(e => {
      const expenseDate = new Date(e.date)
      const today = new Date()
      const daysDiff = (today - expenseDate) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    })
    .reduce((acc, e) => {
      const date = e.date
      if (!acc[date]) acc[date] = 0
      acc[date] += parseFloat(e.amount) || 0
      return acc
    }, {})

  const lineData = Object.entries(lineChartData)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, amount]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), amount }))

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-4 sm:p-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Finance Tracker</h1>
        <p className="text-orange-100 text-sm sm:text-base">Track your expenses and spending</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Today</h3>
            <Calendar className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">${stats.today.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">${stats.month.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Average Daily</h3>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">
            ${(stats.month / new Date().getDate()).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-2 mb-6">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Spending Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense Log */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Expense Log</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddExpense} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses logged yet. Add your first expense!</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">${parseFloat(expense.amount).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

