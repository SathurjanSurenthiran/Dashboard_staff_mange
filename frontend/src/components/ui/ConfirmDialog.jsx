import { X, AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-navy">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{message}</p>
          </div>
          <button onClick={onCancel} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-secondary" disabled={loading}>Cancel</button>
          <button onClick={onConfirm} className="btn-danger"   disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
