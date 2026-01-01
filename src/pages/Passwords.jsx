import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Lock, Plus, Eye, EyeOff, Search } from 'lucide-react'

export default function Passwords() {
  const [passwords, setPasswords] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newPassword, setNewPassword] = useState({
    service: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  })
  const [visiblePasswords, setVisiblePasswords] = useState({})

  useEffect(() => {
    loadPasswords()
  }, [])

  const loadPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .order('service', { ascending: true })

      if (error) throw error
      setPasswords(data || [])
    } catch (error) {
      console.error('Error loading passwords:', error)
    }
  }

  const handleAddPassword = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('passwords')
        .insert([{
          service: newPassword.service,
          username: newPassword.username,
          password: newPassword.password,
          url: newPassword.url,
          notes: newPassword.notes
        }])

      if (error) throw error

      setNewPassword({
        service: '',
        username: '',
        password: '',
        url: '',
        notes: ''
      })
      setShowAddForm(false)
      loadPasswords()
    } catch (error) {
      console.error('Error adding password:', error)
      alert('Error adding password')
    }
  }

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const maskPassword = (password) => {
    return '•'.repeat(password.length)
  }

  const filteredPasswords = passwords.filter(p =>
    p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 sm:p-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Password Manager</h1>
        <p className="text-indigo-100 text-sm sm:text-base">Securely store your passwords</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Password
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddPassword} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Service/Website name"
                value={newPassword.service}
                onChange={(e) => setNewPassword({ ...newPassword, service: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Username/Email"
                value={newPassword.username}
                onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newPassword.password}
                onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="url"
                placeholder="URL (optional)"
                value={newPassword.url}
                onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={newPassword.notes}
              onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
              rows="3"
              className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
          {filteredPasswords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'No passwords found.' : 'No passwords stored yet. Add your first password!'}
            </p>
          ) : (
            filteredPasswords.map((pwd) => (
              <div
                key={pwd.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-800">{pwd.service}</h3>
                      {pwd.url && (
                        <a
                          href={pwd.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Username:</span> {pwd.username}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Password:</span>{' '}
                        {visiblePasswords[pwd.id] ? pwd.password : maskPassword(pwd.password)}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(pwd.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visiblePasswords[pwd.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {pwd.notes && (
                      <p className="text-sm text-gray-500 mt-2">{pwd.notes}</p>
                    )}
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

