import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '../../lib/axios'
import ErrorMessage from '../ui/ErrorMessage'

export default function ClockInModal({ onClose, onSaved }) {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ employee_id: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load active employees for the dropdown
    api.get('/employees', { params: { status: 'active', limit: 100 } })
      .then(({ data }) => setEmployees(data.data || []))
      .catch(() => setError('Failed to load employees'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.employee_id) { setError('Please select an employee'); return }
    setError('')
    setLoading(true)
    try {
      await api.post('/attendance/clock-in', {
        employee_id: parseInt(form.employee_id),
        notes: form.notes,
      })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clock in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Clock In Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee *</label>
            <select
              className="input-field"
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              required
            >
              <option value="">Select employee…</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name} — {e.position}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any notes…"
            />
          </div>
          <ErrorMessage message={error} />
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Clocking in…' : 'Clock In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
