import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Users, CheckCircle2, Star, Zap } from 'lucide-react'
import api from '../lib/axios'
import ErrorMessage from '../components/ui/ErrorMessage'
import SuccessToast from '../components/ui/SuccessToast'

/*  Animated SVG Illustration  */
function RegisterIllustration() {
  return (
    <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs drop-shadow-2xl">
      {/* Glow */}
      <ellipse cx="210" cy="310" rx="130" ry="28" fill="rgba(255,255,255,0.08)" />

      {/* Main card */}
      <rect x="70" y="60" width="280" height="220" rx="20" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />

      {/* Profile avatar */}
      <circle cx="210" cy="110" r="34" fill="white" fillOpacity="0.25" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="210" cy="102" r="14" fill="white" fillOpacity="0.5" />
      <ellipse cx="210" cy="130" rx="21" ry="12" fill="white" fillOpacity="0.4" />

      {/* Name field */}
      <rect x="100" y="158" width="220" height="12" rx="6" fill="white" fillOpacity="0.5" />
      {/* Email field */}
      <rect x="100" y="180" width="180" height="10" rx="5" fill="white" fillOpacity="0.3" />
      {/* Role badge */}
      <rect x="100" y="200" width="80" height="20" rx="10" fill="white" fillOpacity="0.2" />
      <rect x="195" y="200" width="60" height="20" rx="10" fill="white" fillOpacity="0.3" />

      {/* Checkboxes / permissions */}
      <rect x="100" y="232" width="16" height="16" rx="4" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      <path d="M103 240 l4 4 7-7" stroke="white" strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="124" y="235" width="80" height="8" rx="4" fill="white" fillOpacity="0.4" />

      <rect x="100" y="254" width="16" height="16" rx="4" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      <path d="M103 262 l4 4 7-7" stroke="white" strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="124" y="257" width="100" height="8" rx="4" fill="white" fillOpacity="0.4" />

      {/* Floating success badge */}
      <rect x="280" y="40" width="110" height="44" rx="12" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="300" cy="62" r="8" fill="#2dd4bf" fillOpacity="0.9" />
      <path d="M296 62 l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="314" y="56" width="60" height="6" rx="3" fill="white" fillOpacity="0.7" />
      <rect x="314" y="66" width="45" height="4" rx="2" fill="white" fillOpacity="0.4" />

      {/* Floating team badge */}
      <rect x="20" y="260" width="90" height="44" rx="12" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="40" cy="278" r="8" fill="white" fillOpacity="0.3" />
      <circle cx="54" cy="278" r="8" fill="white" fillOpacity="0.3" />
      <circle cx="68" cy="278" r="8" fill="white" fillOpacity="0.3" />
      <rect x="30" y="291" width="60" height="4" rx="2" fill="white" fillOpacity="0.4" />

      {/* Stars */}
      <circle cx="55" cy="55" r="4" fill="white" fillOpacity="0.3" />
      <circle cx="380" cy="180" r="3" fill="white" fillOpacity="0.25" />
      <circle cx="40" cy="180" r="3" fill="white" fillOpacity="0.2" />
      <circle cx="370" cy="300" r="4" fill="white" fillOpacity="0.2" />
    </svg>
  )
}

/*  Benefit item  */
function BenefitItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(255,255,255,0.15)' }}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-white/60 text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

/*  Form field  */
function FormField({ label, type, placeholder, value, onChange, icon }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                     focus:bg-white placeholder-gray-400 transition-all duration-200"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  )
}

const PersonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
)
const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

/*  Page  */
export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: '#eef2ff' }}>

      {/* Success toast */}
      <SuccessToast message="Account created successfully! Please sign in 🎉" show={success} />

      {/*  LEFT PANEL  */}
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
        <div className="absolute top-1/4 right-12 w-40 h-40 rounded-full"
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
            <RegisterIllustration />
          </div>

          {/* Tagline */}
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            Join 1,000+ Restaurant<br />Teams Today
          </h2>
          <p className="text-white/70 text-sm mb-5 leading-relaxed">
            Set up your admin dashboard in minutes<br />and start managing your team effortlessly.
          </p>

          {/* Benefits */}
          <div className="text-left space-y-3">
            <BenefitItem icon={CheckCircle2} title="Quick Setup" desc="Get started in under 5 minutes" />
            <BenefitItem icon={Star}         title="All Features Included" desc="No hidden fees or limitations" />
            <BenefitItem icon={Zap}          title="Real-time Updates" desc="Live attendance and analytics" />
          </div>
        </div>
      </div>

      {/*  RIGHT PANEL (FORM)  */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-4 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#0d9488' }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-navy font-bold text-lg">RestaurantHR</span>
          </div>

          {/* Heading */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-navy mb-1">Create Account ✨</h2>
            <p className="text-gray-400 text-sm">Set up your restaurant admin dashboard</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
            <form onSubmit={handleSubmit} className="space-y-3">

              <FormField
                label="Full Name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                icon={<PersonIcon />}
              />
              <FormField
                label="Email Address"
                type="email"
                placeholder="example@gamil.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                icon={<MailIcon />}
              />
              <FormField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                icon={<LockIcon />}
              />
              <FormField
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                icon={<LockIcon />}
              />

              <ErrorMessage message={error} />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-6 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-xl active:scale-[0.98] mt-2"
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
                    Creating account…
                  </>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#0d9488' }}>
                Sign in
              </Link>
            </p>

          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-3">
            By registering you agree to our Terms & Privacy Policy 📄
          </p>
        </div>
      </div>
    </div>
  )
}
