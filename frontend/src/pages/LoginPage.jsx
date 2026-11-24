import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Users, TrendingUp, Shield, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ErrorMessage from '../components/ui/ErrorMessage'
import SuccessToast from '../components/ui/SuccessToast'

/* ─── Animated SVG Illustration ──────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs drop-shadow-2xl">
      {/* Glow behind */}
      <ellipse cx="210" cy="330" rx="120" ry="30" fill="rgba(255,255,255,0.08)" />

      {/* Dashboard card */}
      <rect x="60" y="100" width="300" height="200" rx="20" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      <rect x="80" y="120" width="260" height="12" rx="6" fill="white" fillOpacity="0.4" />
      <rect x="80" y="142" width="180" height="8" rx="4" fill="white" fillOpacity="0.25" />

      {/* Stat boxes */}
      <rect x="80" y="165" width="75" height="55" rx="10" fill="white" fillOpacity="0.18" />
      <rect x="167" y="165" width="75" height="55" rx="10" fill="white" fillOpacity="0.18" />
      <rect x="254" y="165" width="66" height="55" rx="10" fill="white" fillOpacity="0.18" />

      {/* Stat numbers */}
      <rect x="90" y="175" width="40" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="90" y="190" width="55" height="6" rx="3" fill="white" fillOpacity="0.3" />
      <rect x="177" y="175" width="40" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="177" y="190" width="55" height="6" rx="3" fill="white" fillOpacity="0.3" />
      <rect x="264" y="175" width="40" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="264" y="190" width="40" height="6" rx="3" fill="white" fillOpacity="0.3" />

      {/* Chart bars */}
      <rect x="80" y="253" width="14" height="30" rx="4" fill="white" fillOpacity="0.5" />
      <rect x="100" y="240" width="14" height="43" rx="4" fill="white" fillOpacity="0.7" />
      <rect x="120" y="248" width="14" height="35" rx="4" fill="white" fillOpacity="0.5" />
      <rect x="140" y="235" width="14" height="48" rx="4" fill="white" fillOpacity="0.8" />
      <rect x="160" y="244" width="14" height="39" rx="4" fill="white" fillOpacity="0.5" />
      <rect x="180" y="231" width="14" height="52" rx="4" fill="white" fillOpacity="0.9" />

      {/* Avatar row */}
      <circle cx="230" cy="257" r="14" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="258" cy="257" r="14" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="286" cy="257" r="14" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      <text x="222" y="262" fill="white" fillOpacity="0.8" fontSize="11" fontWeight="bold">HR</text>
      <text x="250" y="262" fill="white" fillOpacity="0.8" fontSize="11" fontWeight="bold">EX</text>
      <text x="278" y="262" fill="white" fillOpacity="0.8" fontSize="11" fontWeight="bold">+5</text>

      {/* Floating badge top-right */}
      <rect x="295" y="75" width="90" height="36" rx="10" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="313" cy="93" r="7" fill="#2dd4bf" fillOpacity="0.8" />
      <rect x="325" y="87" width="45" height="6" rx="3" fill="white" fillOpacity="0.7" />
      <rect x="325" y="97" width="30" height="4" rx="2" fill="white" fillOpacity="0.4" />

      {/* Floating badge bottom-left */}
      <rect x="30" y="290" width="100" height="40" rx="10" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="44" y="302" width="50" height="6" rx="3" fill="white" fillOpacity="0.7" />
      <rect x="44" y="314" width="70" height="4" rx="2" fill="white" fillOpacity="0.4" />

      {/* Decorative dots */}
      <circle cx="50" cy="130" r="5" fill="white" fillOpacity="0.3" />
      <circle cx="370" cy="250" r="4" fill="white" fillOpacity="0.2" />
      <circle cx="380" cy="120" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="40" cy="230" r="3" fill="white" fillOpacity="0.2" />
      <circle cx="200" cy="380" r="6" fill="white" fillOpacity="0.15" />
    </svg>
  )
}

/* ─── Feature badge ───────────────────────────────────────────────────────── */
function FeaturePill({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/90">
      <Icon className="w-4 h-4 text-primary-200" />
      {text}
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]           = useState({ email: '', password: '' })
  const [showPassword, setShowPw] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      setSuccess(true)
      setTimeout(() => navigate('/', { replace: true }), 1800)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: '#eef2ff' }}>

      {/* Success toast */}
      <SuccessToast message="Login successful! Welcome back 🎉" show={success} />

      {/* ══════════════════ LEFT PANEL ══════════════════ */}
      <div
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col items-center justify-center p-10"
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #115e59 100%)',
        }}
      >
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute top-1/3 right-8 w-48 h-48 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
        {/* Wave divider shape (right edge) */}
        <svg
          className="absolute right-0 top-0 h-full"
          viewBox="0 0 80 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M80 0 Q20 200 60 400 Q100 600 20 800 L80 800 Z"
            fill="#eef2ff"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white leading-tight">RestaurantHR</h1>
              <p className="text-xs text-white/60 tracking-widest uppercase">Management Suite</p>
            </div>
          </div>

          {/* Illustration */}
          <div className="mb-6">
            <HeroIllustration />
          </div>

          {/* Tagline */}
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            Smart HR for<br />Modern Restaurants
          </h2>
          <p className="text-white/70 text-sm mb-5 leading-relaxed">
            Manage employees, track attendance, and<br />grow your team — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <FeaturePill icon={Users}     text="Team Management" />
            <FeaturePill icon={Clock}     text="Attendance Tracking" />
            <FeaturePill icon={TrendingUp} text="Analytics" />
            <FeaturePill icon={Shield}    text="Secure & Reliable" />
          </div>
        </div>
      </div>

      {/* ══════════════════ RIGHT PANEL (FORM) ══════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#0d9488' }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-navy font-bold text-lg">RestaurantHR</span>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-navy mb-1">Welcome back 👋</h2>
            <p className="text-gray-400 text-sm">Sign in to your admin account to continue</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                               focus:bg-white placeholder-gray-400 transition-all duration-200"
                    placeholder="admin@restaurant.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                               focus:bg-white placeholder-gray-400 transition-all duration-200"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <ErrorMessage message={error} />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-xl active:scale-[0.98]"
                style={{
                  background: loading
                    ? '#0d9488'
                    : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">New here?</span>
              </div>
            </div>

            <Link
              to="/register"
              className="block w-full py-3 px-6 rounded-xl font-semibold text-sm text-center border-2
                         transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
              style={{ borderColor: '#0d9488', color: '#0d9488' }}
            >
              Create an Account
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Protected by enterprise-grade security 🔒
          </p>
        </div>
      </div>
    </div>
  )
}
