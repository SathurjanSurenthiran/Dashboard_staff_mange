import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

/**
 * AlertToast — slides in from the top, auto-dismisses after `duration` ms.
 * Props:
 *   message  : string            – the text to show
 *   type     : 'success'|'error' – controls colour (default 'success')
 *   show     : boolean           – controlled visibility trigger
 *   duration : number            – ms before it hides itself (default 2800)
 */
export default function AlertToast({ message, type = 'success', show, duration = 2800 }) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
      const enterTimer   = setTimeout(() => setVisible(true), 20)
      const exitTimer    = setTimeout(() => setVisible(false), duration - 300)
      const unmountTimer = setTimeout(() => setMounted(false), duration)
      return () => {
        clearTimeout(enterTimer)
        clearTimeout(exitTimer)
        clearTimeout(unmountTimer)
      }
    }
  }, [show, duration])

  if (!mounted) return null

  const isError = type === 'error'

  const bg = isError
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'

  const shadow = isError
    ? '0 8px 32px rgba(239,68,68,0.40), 0 2px 8px rgba(0,0,0,0.12)'
    : '0 8px 32px rgba(13,148,136,0.45), 0 2px 8px rgba(0,0,0,0.12)'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        pointerEvents: 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: bg,
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '14px',
          boxShadow: shadow,
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '0.01em',
          maxWidth: '420px',
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isError
            ? <XCircle size={16} color="#ffffff" />
            : <CheckCircle2 size={16} color="#ffffff" />}
        </div>

        <span>{message}</span>

        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            borderRadius: '0 0 14px 14px',
            background: 'rgba(255,255,255,0.5)',
            animation: visible ? `shrink ${duration - 300}ms linear forwards` : 'none',
          }}
        />

        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to   { width: 0%;   }
          }
        `}</style>
      </div>
    </div>
  )
}
