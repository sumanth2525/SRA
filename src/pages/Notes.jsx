import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FileText, Plus, Bell, CheckCircle, Circle, Calendar } from 'lucide-react'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [reminders, setReminders] = useState([])
  const [todos, setTodos] = useState([])
  const [activeTab, setActiveTab] = useState('notes')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [newReminder, setNewReminder] = useState({ title: '', description: '', due_date: '', is_payment: false })
  const [newTodo, setNewTodo] = useState({ title: '', description: '', due_date: '' })

  useEffect(() => {
    loadNotes()
    loadReminders()
    loadTodos()
  }, [])

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  }

  const loadReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true })

      if (error) throw error
      setReminders(data || [])
    } catch (error) {
      console.error('Error loading reminders:', error)
    }
  }

  const loadTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error loading todos:', error)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title: newNote.title, content: newNote.content }])

      if (error) throw error

      setNewNote({ title: '', content: '' })
      setShowAddForm(false)
      loadNotes()
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Error adding note')
    }
  }

  const handleAddReminder = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert([{
          title: newReminder.title,
          description: newReminder.description,
          due_date: newReminder.due_date,
          is_payment: newReminder.is_payment
        }])

      if (error) throw error

      setNewReminder({ title: '', description: '', due_date: '', is_payment: false })
      setShowAddForm(false)
      loadReminders()
    } catch (error) {
      console.error('Error adding reminder:', error)
      alert('Error adding reminder')
    }
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          title: newTodo.title,
          description: newTodo.description,
          due_date: newTodo.due_date,
          completed: false
        }])

      if (error) throw error

      setNewTodo({ title: '', description: '', due_date: '' })
      setShowAddForm(false)
      loadTodos()
    } catch (error) {
      console.error('Error adding todo:', error)
      alert('Error adding todo')
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error
      loadTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 sm:p-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Notes & Reminders</h1>
        <p className="text-purple-100 text-sm sm:text-base">Organize your thoughts and stay on track</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-2 border-b">
          {[
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'reminders', label: 'Reminders', icon: Bell },
            { id: 'todos', label: 'To-Do List', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setShowAddForm(false)
                }}
                className={`flex items-center px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Notes</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Note
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddNote} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                placeholder="Note content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows="6"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {notes.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8">No notes yet. Create your first note!</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{note.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Reminders</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Reminder
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddReminder} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Reminder title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                placeholder="Description"
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="datetime-local"
                  value={newReminder.due_date}
                  onChange={(e) => setNewReminder({ ...newReminder, due_date: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newReminder.is_payment}
                    onChange={(e) => setNewReminder({ ...newReminder, is_payment: e.target.checked })}
                    className="mr-2"
                  />
                  Payment Reminder
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
            {reminders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reminders yet. Add your first reminder!</p>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    reminder.is_payment
                      ? 'bg-red-50 border-red-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-800">{reminder.title}</h3>
                        {reminder.is_payment && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Payment</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(reminder.due_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Todos Tab */}
      {activeTab === 'todos' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">To-Do List</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Todo
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddTodo} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Todo title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                placeholder="Description"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="date"
                value={newTodo.due_date}
                onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No todos yet. Add your first task!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    todo.completed
                      ? 'bg-green-50 border-green-500 opacity-75'
                      : 'bg-white border-purple-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      className="mt-1"
                    >
                      {todo.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                      )}
                      {todo.due_date && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {new Date(todo.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

