import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Activity, Target, TrendingUp, Plus } from 'lucide-react'

export default function Health() {
  const [proteinCount, setProteinCount] = useState(0)
  const [targetProtein, setTargetProtein] = useState(150)
  const [foodEntries, setFoodEntries] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFood, setNewFood] = useState({ name: '', protein: '', calories: '' })

  useEffect(() => {
    loadFoodEntries()
  }, [])

  const loadFoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setFoodEntries(data || [])
      const total = (data || []).reduce((sum, entry) => sum + (entry.protein || 0), 0)
      setProteinCount(total)
    } catch (error) {
      console.error('Error loading food entries:', error)
    }
  }

  const handleAddFood = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert([
          {
            name: newFood.name,
            protein: parseFloat(newFood.protein),
            calories: parseFloat(newFood.calories),
            date: new Date().toISOString().split('T')[0]
          }
        ])

      if (error) throw error

      setNewFood({ name: '', protein: '', calories: '' })
      setShowAddForm(false)
      loadFoodEntries()
    } catch (error) {
      console.error('Error adding food:', error)
      const errorMessage = error?.message || error?.error_description || 'Unknown error occurred'
      alert(`Error adding food entry: ${errorMessage}\n\nCheck browser console for details.`)
    }
  }

  const proteinPercentage = (proteinCount / targetProtein) * 100

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Health Tracking</h1>
        <p className="text-blue-100 text-sm sm:text-base">Track your protein intake and nutrition</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Protein Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Protein</h3>
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f97316"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - proteinPercentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{proteinCount}g</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Target: {targetProtein}g
          </p>
        </div>

        {/* Calories Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Calories</h3>
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-800 mb-2">
              {foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">kcal today</p>
          </div>
        </div>

        {/* Weight Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Weight</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-800 mb-2">--</p>
            <p className="text-sm text-gray-600">kg</p>
          </div>
        </div>
      </div>

      {/* Food Log */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Food Log</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Food
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddFood} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Food name"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={newFood.protein}
                onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Calories"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          {foodEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No food entries yet. Add your first meal!</p>
          ) : (
            foodEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{entry.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">{entry.protein}g</p>
                    <p className="text-xs text-gray-600">Protein</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{entry.calories}</p>
                    <p className="text-xs text-gray-600">Calories</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

