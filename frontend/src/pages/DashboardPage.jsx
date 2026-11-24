import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, UserCheck, UserX, Clock,
  CalendarCheck, ArrowUpRight, LogIn, LogOut,
  TrendingUp,
} from 'lucide-react'
import api from '../lib/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/*  Stat card (top row)  */
function StatCard({ icon: Icon, label, value, iconBg, iconColor, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate">{label}</p>
        <p className="text-2xl font-bold text-navy mt-0.5">{value ?? '—'}</p>
      </div>
      {trend != null && (
        <div className="ml-auto shrink-0">
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}%
          </span>
        </div>
      )}
    </div>
  )
}

/*  Mini metric card (2-col grid)  */
function MetricCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-3xl font-bold text-navy">{value ?? '—'}</p>
    </div>
  )
}

/*  Quick-action link card  */
function QuickCard({ to, icon: Icon, title, subtitle, iconBg, iconColor }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-5
                 flex items-center gap-4 hover:shadow-card-hover transition-all duration-200 group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                       group-hover:bg-primary-600 ${iconBg}`}>
        <Icon className={`w-4.5 h-4.5 transition-colors group-hover:text-white ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-navy">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors shrink-0" />
    </Link>
  )
}

/*  Activity badge  */
function ActivityDot({ type }) {
  return type === 'clock_in'
    ? <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
    : <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
}


export default function DashboardPage() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-6">

      {/*  Page heading  */}
      <div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
          Overview
        </p>
        <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">{today}</p>
      </div>

      {/*  Top stat row  */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats?.total_employees}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={null}
        />
        <StatCard
          icon={UserCheck}
          label="Active Employees"
          value={stats?.active_employees}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={null}
        />
        <StatCard
          icon={CalendarCheck}
          label="Today's Attendance"
          value={stats?.today_attendance}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          trend={null}
        />
      </div>

      {/*  Middle section: 2-col metrics + right panel  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left — 2 × 2 metric grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <MetricCard
            icon={UserX}
            label="Inactive"
            value={stats?.inactive_employees}
            iconBg="bg-red-50"
            iconColor="text-red-500"
          />
          <MetricCard
            icon={Clock}
            label="Currently Working"
            value={stats?.currently_working}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
          />

          {/* Quick actions span full width inside the left col */}
          <QuickCard
            to="/employees"
            icon={Users}
            title="Manage Employees"
            subtitle="View, add or edit staff"
            iconBg="bg-primary-50"
            iconColor="text-primary-600"
          />
          <QuickCard
            to="/attendance"
            icon={Clock}
            title="Attendance"
            subtitle="Clock in / clock out"
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
          />
        </div>

        {/* Right — Recent activity panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-navy">Recent Activity</h2>
            <Link
              to="/attendance"
              className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {!stats?.recent_activities?.length ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <Clock className="w-8 h-8 mb-2" />
                <p className="text-xs font-medium">No activity yet</p>
              </div>
            ) : (
              stats.recent_activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${a.type === 'clock_in' ? 'bg-primary-50' : 'bg-gray-100'}`}>
                    {a.type === 'clock_in'
                      ? <LogIn  className="w-3.5 h-3.5 text-primary-600" />
                      : <LogOut className="w-3.5 h-3.5 text-gray-400" />
                    }
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ActivityDot type={a.type} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/*  CTA Banner  */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white shadow-sm">
        {/* decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 right-20 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary-100 uppercase tracking-widest mb-1">
              Quick Action
            </p>
            <h3 className="text-xl font-bold">Record today's attendance</h3>
            <p className="text-sm text-primary-100 mt-1">
              Keep your staff schedule up to date with one click.
            </p>
          </div>
          <Link
            to="/attendance"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-primary-700
                       font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50
                       transition-colors shadow-sm self-start sm:self-auto"
          >
            <Clock className="w-4 h-4" />
            Go to Attendance
          </Link>
        </div>
      </div>

    </div>
  )
}
