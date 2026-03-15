import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Menu, X, Moon, Sun, Heart, User, LogOut, ChevronDown, History } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ darkMode, setDarkMode }) {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  // Close user menu on outside click
  useEffect(() => {
    const handler = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/predict', label: 'Check Risk' },
    { to: '/history', label: 'History' },
  ]

  const isActive = to => location.pathname === to

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-azure-500 to-azure-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow-blue transition-all duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-800 dark:text-white">
              VitalScan<span className="text-azure-600"> AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-azure-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              /* User avatar + dropdown */
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-azure-500 to-azure-700 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-card-hover border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.full_name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/predict" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Heart className="w-4 h-4 text-azure-500" />
                        New Prediction
                      </Link>
                      <Link to="/history" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <History className="w-4 h-4 text-azure-500" />
                        My History
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20 w-full text-left transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 pb-5 animate-fade-in">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.to) ? 'bg-azure-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}>
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mt-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-8 h-8 bg-azure-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.full_name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-all text-left">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-outline text-sm text-center mt-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm text-center mt-1">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
