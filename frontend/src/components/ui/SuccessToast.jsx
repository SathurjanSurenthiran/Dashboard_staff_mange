import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

/**
 * SuccessToast — slides in from the top, auto-dismisses after `duration` ms.
 * Props:
 *   message  : string   – the text to show
 *   show     : boolean  – controlled visibility
 *   duration : number   – ms before it hides itself (default 2500)
 */
export default function SuccessToast({ message, show, duration = 2500 }) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
      // tiny delay so the CSS transition fires
      const enterTimer = setTimeout(() => setVisible(true), 20)
      const exitTimer  = setTimeout(() => setVisible(false), duration - 300)
      const unmountTimer = setTimeout(() => setMounted(false), duration)
      return () => {
        clearTimeout(enterTimer)
        clearTimeout(exitTimer)
        clearTimeout(unmountTimer)
      }
    }
  }, [show, duration])

  if (!mounted) return null

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
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(13, 148, 136, 0.45), 0 2px 8px rgba(0,0,0,0.12)',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '0.01em',
          maxWidth: '420px',
          pointerEvents: 'auto',
        }}
      >
        {/* Animated check circle */}
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
          <CheckCircle2 size={16} color="#ffffff" />
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
