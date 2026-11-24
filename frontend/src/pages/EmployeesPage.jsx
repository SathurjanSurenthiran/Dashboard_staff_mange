import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import api from '../lib/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import EmployeeModal from '../components/employees/EmployeeModal'

function StatusBadge({ status }) {
  return status === 'active'
    ? <span className="badge-active">Active</span>
    : <span className="badge-inactive">Inactive</span>
}

export default function EmployeesPage() {
  const navigate = useNavigate()
  const [employees, setEmployees]   = useState([])
  const [meta, setMeta]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('')
  const [page, setPage]             = useState(1)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]     = useState(false)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/employees', {
        params: { search, status: statusFilter, page, limit: 10 },
      })
      setEmployees(data.data)
      setMeta(data.meta)
    } catch {
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, page])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit   = (emp) => { setEditTarget(emp); setModalOpen(true) }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/employees/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchEmployees()
    } catch {
      setError('Failed to delete employee')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your restaurant staff</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search by name, email or position…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field sm:w-40"
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : employees.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No employees found</p>
            <p className="text-sm mt-1">Add your first employee to get started</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Name', 'Position', 'Phone', 'Salary', 'Joining Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{emp.position}</td>
                      <td className="px-4 py-3 text-gray-500">{emp.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-700">₹{emp.salary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(emp.joining_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View"
                          ><Eye className="w-4 h-4" /></button>
                          <button
                            onClick={() => openEdit(emp)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                            title="Edit"
                          ><Pencil className="w-4 h-4" /></button>
                          <button
                            onClick={() => setDeleteTarget(emp)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          ><Trash2 className="w-4 h-4" /></button>
                        </div>
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

      {/* Create/Edit Modal */}
      {modalOpen && (
        <EmployeeModal
          employee={editTarget}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchEmployees() }}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
