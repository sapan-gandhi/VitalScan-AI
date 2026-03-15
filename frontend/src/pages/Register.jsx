import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number',     pass: /\d/.test(password) },
    { label: 'Contains a letter',     pass: /[a-zA-Z]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['bg-coral-500', 'bg-amber-500', 'bg-mint-500']
  const labels = ['Weak', 'Fair', 'Strong']

  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.pass ? 'text-mint-600 dark:text-mint-400' : 'text-slate-400'}`}>
            {c.pass
              ? <CheckCircle className="w-3 h-3" />
              : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600" />
            }
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Register() {
  const navigate    = useNavigate()
  const { register } = useAuth()

  const [form, setForm]       = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const res = await register(form.email, form.password, form.full_name)
      if (res.success) {
        if (res.access_token) {
          navigate('/predict', { replace: true })
        } else {
          // Email confirmation required
          setSuccess(true)
        }
      } else {
        setError(res.message || 'Registration failed.')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-10 max-w-md w-full text-center animate-scale-in">
          <div className="w-16 h-16 bg-mint-100 dark:bg-mint-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-mint-600" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-800 dark:text-white mb-3">
            Check your inbox!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
            We've sent a confirmation link to <strong className="text-slate-700 dark:text-slate-200">{form.email}</strong>.
            Click the link to activate your account, then log in.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mint-700 via-azure-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-mint-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-azure-500/15 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">VitalScan <span className="text-mint-300">AI</span></span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-mint-200 text-xs font-semibold mb-6">
            <Shield className="w-3.5 h-3.5" />
            Free forever · No credit card
          </div>
          <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-4">
            Start your health<br />
            <span className="text-mint-300">journey today.</span>
          </h2>
          <p className="text-mint-100/80 text-base leading-relaxed max-w-sm">
            Join thousands of users tracking their chronic disease risk with AI-powered predictions.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { icon: '🔒', title: 'Private & Secure',    desc: 'Your health data stays yours' },
              { icon: '⚡', title: 'Instant Results',     desc: 'Predictions in under 5 seconds' },
              { icon: '🎯', title: '94% Accuracy',        desc: 'Clinically validated models' },
              { icon: '📊', title: 'Full History',        desc: 'Track changes over time' },
            ].map(f => (
              <div key={f.title} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl p-4">
                <div className="text-xl mb-2">{f.icon}</div>
                <p className="text-white font-semibold text-sm">{f.title}</p>
                <p className="text-mint-200/80 text-xs mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-mint-300/60 text-xs relative z-10">
          Supporting UN SDG Goal 3 — Good Health & Well-Being
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-azure-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-800 dark:text-white">VitalScan <span className="text-azure-600">AI</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-slate-800 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Free forever. No credit card required.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 text-coral-700 dark:text-coral-400 rounded-xl px-4 py-3 mb-6 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="input-field pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Email Address
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
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="input-field pl-10 pr-11 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className={`input-field pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 ${
                    form.confirm && form.confirm !== form.password ? 'border-coral-400 focus:ring-coral-300' : ''
                  }`}
                />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mint-500" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account you agree to our{' '}
            <span className="text-azure-600 cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-azure-600 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <Link to="/login" className="w-full btn-outline flex items-center justify-center gap-2 text-sm">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  )
}
