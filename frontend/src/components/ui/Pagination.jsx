export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total_pages <= 1) return null

  const pages = []
  for (let i = 1; i <= meta.total_pages; i++) pages.push(i)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span>
        {' – '}
        <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span>
        {' of '}
        <span className="font-medium">{meta.total}</span>
      </p>
      <div className="flex gap-1">
        <button
          className="btn-secondary px-3 py-1 text-xs"
          disabled={!meta.has_prev_page}
          onClick={() => onPageChange(meta.page - 1)}
        >Prev</button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
              ${p === meta.page
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >{p}</button>
        ))}
        <button
          className="btn-secondary px-3 py-1 text-xs"
          disabled={!meta.has_next_page}
          onClick={() => onPageChange(meta.page + 1)}
        >Next</button>
      </div>
    </div>
  )
}
