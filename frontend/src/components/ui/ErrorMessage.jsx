import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
