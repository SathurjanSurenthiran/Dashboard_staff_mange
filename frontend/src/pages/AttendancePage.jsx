import { useEffect, useState, useCallback } from 'react'
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react'
import api from '../lib/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import Pagination from '../components/ui/Pagination'
import ClockInModal from '../components/attendance/ClockInModal'

function HoursBadge({ hours }) {
  if (hours == null) return <span className="badge-working">Active</span>
  return <span className="text-sm font-medium text-gray-700">{hours}h</span>
}

export default function AttendancePage() {
  const [records, setRecords]       = useState([])
  const [todayRecords, setToday]    = useState([])
  const [meta, setMeta]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [page, setPage]             = useState(1)
  const [dateFilter, setDateFilter] = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [clockingOut, setClockin]   = useState(null) // attendance ID being clocked out

  const fetchToday = useCallback(() =>
    api.get('/attendance/today').then(({ data }) => setToday(data.data || [])), [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/attendance', {
        params: { date: dateFilter, page, limit: 10 },
      })
      setRecords(data.data)
      setMeta(data.meta)
    } catch {
      setError('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }, [dateFilter, page])

  useEffect(() => {
    fetchToday()
    fetchAll()
  }, [fetchToday, fetchAll])

  useEffect(() => { setPage(1) }, [dateFilter])

  const handleClockOut = async (id) => {
    setClockin(id)
    try {
      await api.put(`/attendance/${id}/clock-out`, {})
      fetchToday()
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clock out')
    } finally {
      setClockin(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Track employee working hours</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto" onClick={() => setModalOpen(true)}>
          <LogIn className="w-4 h-4" /> Clock In
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Today's active sessions */}
      {todayRecords.filter(r => !r.end_time).length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            Currently Working ({todayRecords.filter(r => !r.end_time).length})
          </h2>
          <div className="space-y-2">
            {todayRecords.filter(r => !r.end_time).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.employee?.name}</p>
                  <p className="text-xs text-gray-500">
                    Clocked in at {new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => handleClockOut(r.id)}
                  disabled={clockingOut === r.id}
                  className="flex items-center gap-1.5 btn-secondary text-xs py-1.5 px-3"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {clockingOut === r.id ? 'Clocking out…' : 'Clock Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <label className="text-sm font-medium text-gray-600">Filter by date:</label>
          <input
            type="date"
            className="input-field sm:w-48"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-sm text-primary-600 hover:underline">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Attendance table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Attendance Records</h2>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : records.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No attendance records found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Employee', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Notes', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{r.employee?.name}</p>
                        <p className="text-xs text-gray-400">{r.employee?.position}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r.end_time
                          ? new Date(r.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td className="px-4 py-3"><HoursBadge hours={r.total_hours} /></td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{r.notes || '—'}</td>
                      <td className="px-4 py-3">
                        {!r.end_time && (
                          <button
                            onClick={() => handleClockOut(r.id)}
                            disabled={clockingOut === r.id}
                            className="flex items-center gap-1 text-xs btn-secondary py-1 px-2"
                          >
                            <LogOut className="w-3 h-3" />
                            {clockingOut === r.id ? '…' : 'Out'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>

      {modalOpen && (
        <ClockInModal
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchToday(); fetchAll() }}
        />
      )}
    </div>
  )
}
