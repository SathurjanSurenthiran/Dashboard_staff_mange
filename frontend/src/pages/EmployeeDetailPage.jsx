import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react'
import api from '../lib/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import EmployeeModal from '../components/employees/EmployeeModal'
import Pagination from '../components/ui/Pagination'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)

  const fetchEmployee = () =>
    api.get(`/employees/${id}`).then(({ data }) => setEmployee(data.data))

  const fetchAttendance = () =>
    api.get('/attendance', { params: { employee_id: id, page, limit: 10 } })
      .then(({ data }) => { setAttendance(data.data); setMeta(data.meta) })

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchEmployee(), fetchAttendance()])
      .catch(() => setError('Failed to load employee details'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!loading) fetchAttendance()
  }, [page])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!employee) return null

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </button>

      {/* Profile header */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-sm text-gray-500">{employee.position}</p>
          <span className={employee.status === 'active' ? 'badge-active mt-2 inline-block' : 'badge-inactive mt-2 inline-block'}>
            {employee.status}
          </span>
        </div>
        <button onClick={() => setEditOpen(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Pencil className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Contact Information</h2>
          <InfoRow icon={Mail}     label="Email"   value={employee.email} />
          <InfoRow icon={Phone}    label="Phone"   value={employee.phone} />
          <InfoRow icon={MapPin}   label="Address" value={employee.address} />
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Employment Details</h2>
          <InfoRow icon={Briefcase}   label="Position"     value={employee.position} />
          <InfoRow icon={DollarSign}  label="Salary"       value={`₹${employee.salary?.toLocaleString()}`} />
          <InfoRow icon={Calendar}    label="Joining Date" value={new Date(employee.joining_date).toLocaleDateString()} />
        </div>
      </div>

      {/* Attendance history */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Attendance History</h2>
        </div>
        {attendance.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No attendance records found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Date', 'Clock In', 'Clock Out', 'Total Hours', 'Notes'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(a.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {a.end_time
                          ? new Date(a.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : <span className="badge-working">Active</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {a.total_hours != null ? `${a.total_hours}h` : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{a.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>

      {editOpen && (
        <EmployeeModal
          employee={employee}
          onClose={() => setEditOpen(false)}
          onSaved={() => { setEditOpen(false); fetchEmployee() }}
        />
      )}
    </div>
  )
}
