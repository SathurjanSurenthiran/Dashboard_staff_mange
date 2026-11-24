import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '../../lib/axios'
import ErrorMessage from '../ui/ErrorMessage'

const POSITIONS = [
  'Manager', 'Chef', 'Sous Chef', 'Line Cook', 'Prep Cook',
  'Waiter', 'Waitress', 'Bartender', 'Host/Hostess',
  'Cashier', 'Dishwasher', 'Delivery Driver', 'Cleaner', 'Other',
]

const DEFAULT_FORM = {
  name: '', email: '', phone: '', address: '',
  position: '', salary: '', joining_date: '', status: 'active',
}

export default function EmployeeModal({ employee, onClose, onSaved }) {
  const isEdit = !!employee
  const [form, setForm]       = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (isEdit) {
      setForm({
        name:         employee.name,
        email:        employee.email,
        phone:        employee.phone || '',
        address:      employee.address || '',
        position:     employee.position,
        salary:       String(employee.salary),
        joining_date: employee.joining_date?.split('T')[0] || '',
        status:       employee.status,
      })
    }
  }, [employee, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, salary: parseFloat(form.salary) }
      if (isEdit) {
        await api.put(`/employees/${employee.id}`, payload)
      } else {
        await api.post('/employees', payload)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input name="name" className="input-field" value={form.name} onChange={handleChange} required minLength={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input name="phone" className="input-field" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Position *</label>
              <select name="position" className="input-field" value={form.position} onChange={handleChange} required>
                <option value="">Select position</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary (₹) *</label>
              <input name="salary" type="number" min="0" className="input-field" value={form.salary} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Joining Date *</label>
              <input name="joining_date" type="date" className="input-field" value={form.joining_date} onChange={handleChange} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea name="address" className="input-field resize-none" rows={2} value={form.address} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select name="status" className="input-field" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <ErrorMessage message={error} />

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
