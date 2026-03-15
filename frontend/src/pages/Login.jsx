import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/predict'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      if (res.success) navigate(from, { replace: true })
      else             setError(res.message || 'Login failed.')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-azure-700 via-azure-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-azure-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 bg-mint-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">VitalScan <span className="text-azure-300">AI</span></span>
        </div>

        {/* Centre content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-azure-200 text-xs font-semibold mb-6">
            <div className="w-2 h-2 bg-mint-400 rounded-full animate-pulse" />
            AI-Powered Health Intelligence
          </div>
          <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-4">
            Know Your Risk.<br />
            <span className="text-azure-300">Act Before It's Too Late.</span>
          </h2>
          <p className="text-azure-200 text-base leading-relaxed max-w-sm">
            Get AI-powered predictions for Diabetes, Heart Disease, and Hypertension — personalised to your unique health profile.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-10">
            {[['94%', 'Accuracy'], ['5s', 'Results'], ['3', 'Diseases']].map(([val, label]) => (
              <div key={label}>
                <p className="font-display font-extrabold text-2xl text-white">{val}</p>
                <p className="text-azure-300 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-amber-400 rounded-full" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
            ))}
          </div>
          <p className="text-white/90 text-sm leading-relaxed italic">
            "Early detection changed everything. VitalScan flagged my pre-diabetic markers six months before my doctor did."
          </p>
          <p className="text-azure-300 text-xs mt-2 font-semibold">— Ravi M., Software Engineer</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-azure-600 rounded-xl flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-800 dark:text-white">
              VitalScan <span className="text-azure-600">AI</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-slate-800 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sign in to your account to view your health predictions.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 text-coral-700 dark:text-coral-400 rounded-xl px-4 py-3 mb-6 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="input-field pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                <Link to="/forgot-password" className="text-xs text-azure-600 hover:text-azure-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="input-field pl-10 pr-11 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-azure-600 hover:text-azure-700 font-semibold transition-colors">
              Create one free
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {['256-bit SSL', 'HIPAA Safe', 'No Ads'].map(badge => (
              <div key={badge} className="flex items-center gap-1 text-xs text-slate-400">
                <div className="w-1.5 h-1.5 bg-mint-500 rounded-full" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
