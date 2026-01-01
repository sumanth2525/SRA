import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Activity, DollarSign, FileText, TrendingUp, Lock, Menu, X } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/health', icon: Activity, label: 'Health' },
    { path: '/finance', icon: DollarSign, label: 'Finance' },
    { path: '/notes', icon: FileText, label: 'Notes' },
    { path: '/investments', icon: TrendingUp, label: 'Investments' },
    { path: '/passwords', icon: Lock, label: 'Passwords' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Productivity Tracker</h1>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide in from right */}
        <div
          className={`md:hidden fixed top-16 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg mb-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Overlay when menu is open */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </nav>

      {/* Main Content - Add padding for fixed nav */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {children}
      </main>
    </div>
  )
}
