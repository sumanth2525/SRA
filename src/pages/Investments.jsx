import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TrendingUp, Plus, DollarSign, PieChart, ArrowUp, ArrowDown } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function Investments() {
  const [investments, setInvestments] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: '',
    amount: '',
    purchase_date: new Date().toISOString().split('T')[0],
    current_value: ''
  })

  const investmentTypes = ['Stocks', 'Bonds', 'Crypto', 'Real Estate', 'Mutual Funds', 'Other']

  useEffect(() => {
    loadInvestments()
  }, [])

  const loadInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('purchase_date', { ascending: false })

      if (error) throw error
      setInvestments(data || [])
    } catch (error) {
      console.error('Error loading investments:', error)
    }
  }

  const handleAddInvestment = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert([{
          name: newInvestment.name,
          type: newInvestment.type,
          amount: parseFloat(newInvestment.amount),
          purchase_date: newInvestment.purchase_date,
          current_value: parseFloat(newInvestment.current_value) || parseFloat(newInvestment.amount)
        }])

      if (error) throw error

      setNewInvestment({
        name: '',
        type: '',
        amount: '',
        purchase_date: new Date().toISOString().split('T')[0],
        current_value: ''
      })
      setShowAddForm(false)
      loadInvestments()
    } catch (error) {
      console.error('Error adding investment:', error)
      const errorMessage = error?.message || error?.error_description || 'Unknown error occurred'
      alert(`Error adding investment: ${errorMessage}\n\nCheck browser console for details.`)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (parseFloat(inv.current_value) || parseFloat(inv.amount) || 0), 0)
  const totalGain = totalCurrentValue - totalInvested
  const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  const typeData = investments.reduce((acc, inv) => {
    const type = inv.type || 'Other'
    acc[type] = (acc[type] || 0) + (parseFloat(inv.current_value) || parseFloat(inv.amount) || 0)
    return acc
  }, {})

  const pieData = Object.entries(typeData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 sm:p-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Investment Portfolio</h1>
        <p className="text-green-100 text-sm sm:text-base">Track your investments and growth</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Invested</h3>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">${totalInvested.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Current Value</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">${totalCurrentValue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Gain/Loss</h3>
            {totalGain >= 0 ? (
              <ArrowUp className="w-6 h-6 text-green-500" />
            ) : (
              <ArrowDown className="w-6 h-6 text-red-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalGain.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Return %</h3>
            <PieChart className="w-6 h-6 text-purple-500" />
          </div>
          <p className={`text-3xl font-bold ${gainPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {gainPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Portfolio Distribution */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Investment List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Investments</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Investment
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddInvestment} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Investment name"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                value={newInvestment.type}
                onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Type</option>
                {investmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount invested"
                value={newInvestment.amount}
                onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Current value"
                value={newInvestment.current_value}
                onChange={(e) => setNewInvestment({ ...newInvestment, current_value: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                value={newInvestment.purchase_date}
                onChange={(e) => setNewInvestment({ ...newInvestment, purchase_date: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
          {investments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No investments yet. Add your first investment!</p>
          ) : (
            investments.map((investment) => {
              const gain = (parseFloat(investment.current_value) || parseFloat(investment.amount) || 0) - (parseFloat(investment.amount) || 0)
              const gainPct = (parseFloat(investment.amount) || 0) > 0 ? (gain / parseFloat(investment.amount)) * 100 : 0

              return (
                <div
                  key={investment.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{investment.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {investment.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Purchased: {new Date(investment.purchase_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${(parseFloat(investment.current_value) || parseFloat(investment.amount) || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Invested: ${(parseFloat(investment.amount) || 0).toFixed(2)}
                      </p>
                      <p className={`text-sm font-semibold ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gain >= 0 ? '+' : ''}{gain.toFixed(2)} ({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

